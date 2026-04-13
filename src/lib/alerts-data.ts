import { AlertItem, AlertCategory, OutageStatus } from '@/types/alert';
import { XMLParser } from 'fast-xml-parser';
import { mergeDowndetectorData, loadCustomIncidents, filterLowQualityContent } from './downdetector-integration';

type FeedConfig = {
  url: string;
  category: AlertCategory;
  subcategory: string;
  sourceName: string;
};

const feedConfigs: FeedConfig[] = [
  {
    url: 'https://status.azure.com/en-us/status/feed/',
    category: 'Outage',
    subcategory: 'Azure Status',
    sourceName: 'Azure Status',
  },
  {
    url: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',
    category: 'Microsoft Update',
    subcategory: 'Microsoft 365 Blog',
    sourceName: 'Microsoft 365 Blog',
  },
  {
    url: 'https://www.microsoft.com/en-us/security/blog/feed/',
    category: 'Microsoft Update',
    subcategory: 'Microsoft Security Blog',
    sourceName: 'Microsoft Security Blog',
  },
  {
    url: 'https://status.aws.amazon.com/rss/all.rss',
    category: 'Outage',
    subcategory: 'AWS Status',
    sourceName: 'AWS Health Dashboard',
  },
  {
    url: 'https://www.githubstatus.com/history.rss',
    category: 'Outage',
    subcategory: 'GitHub Status',
    sourceName: 'GitHub Status',
  },
  {
    url: 'https://status.slack.com/feed',
    category: 'Outage',
    subcategory: 'Slack Status',
    sourceName: 'Slack Status',
  },
];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  ignoreDeclaration: true,
  trimValues: true,
});

type ParsedNode = Record<string, unknown>;

type ParsedFeed = ParsedNode & {
  rss?: {
    channel?: {
      item?: unknown;
    };
  };
  feed?: {
    entry?: unknown;
  };
};

type ParsedItem = ParsedNode & {
  title?: unknown;
  link?: unknown;
  pubDate?: unknown;
  updated?: unknown;
  published?: unknown;
  category?: unknown;
  'dc:subject'?: unknown;
  description?: unknown;
  summary?: unknown;
  content?: unknown;
};

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (!value || typeof value !== 'object') return '';
  if (Array.isArray(value)) return value.map(normalizeText).filter(Boolean).join(' ');

  const node = value as ParsedNode;
  const parts: string[] = [];

  if (typeof node['#text'] === 'string') {
    parts.push(node['#text']);
  }

  for (const key of Object.keys(node)) {
    if (key === '#text' || key.startsWith('@_')) continue;
    parts.push(normalizeText(node[key]));
  }

  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&(amp|lt|gt|quot|apos);/gi, (_, entity) => {
      switch (entity.toLowerCase()) {
        case 'amp':
          return '&';
        case 'lt':
          return '<';
        case 'gt':
          return '>';
        case 'quot':
          return '"';
        case 'apos':
          return "'";
        default:
          return '';
      }
    })
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]+>/g, ' ');
}

function getText(value: unknown): string {
  const rawText = normalizeText(value);
  return decodeHtmlEntities(stripHtmlTags(rawText)).trim();
}

function getLink(item: ParsedNode): string {
  if (!item) return '';
  const link = item.link;
  if (typeof link === 'string') return link;
  if (typeof link === 'object' && link !== null) {
    const linkObj = link as ParsedNode;
    if (typeof linkObj.href === 'string') return linkObj.href;
    if (typeof linkObj['@_href'] === 'string') return linkObj['@_href'];
  }
  if (Array.isArray(link)) {
    const alternate = link.find((l) => {
      if (typeof l !== 'object' || l === null) return false;
      const node = l as ParsedNode;
      return node['@_rel'] === 'alternate' || node.rel === 'alternate';
    }) as ParsedNode | undefined;

    if (alternate) {
      if (typeof alternate.href === 'string') return alternate.href;
      if (typeof alternate['@_href'] === 'string') return alternate['@_href'];
    }

    return getText(link[0]);
  }

  return getText(link);
}

function normalizeStatus(text: string): OutageStatus {
  const lowerText = text.toLowerCase();
  
  // Investigating patterns
  if (/investigating|issue detected|started investigating/i.test(lowerText)) return 'Investigating';
  
  // Identified patterns
  if (/identified|root cause|cause identified|we.*identified|we.*found|we.*located/i.test(lowerText)) return 'Identified';
  
  // Monitoring patterns
  if (/monitoring|mitigating|implemented|deployment|fix deployed|applying|working on/i.test(lowerText)) return 'Monitoring';
  
  // Default resolved if doesn't match above
  if (/resolved|recovering|recovered|restored|completed|closed|fixed/i.test(lowerText)) return 'Resolved';
  
  // If status unclear, assume investigating if recent, else monitoring
  return 'Monitoring';
}

function summarizeText(text: string, maxLength = 260): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= maxLength) return trimmed;
  const shortened = trimmed.slice(0, maxLength).trim();
  return `${shortened.replace(/[,;\s]+$/u, '')}…`;
}

function parseFeed(rawXml: string, config: FeedConfig): AlertItem[] {
  const parsed = xmlParser.parse(rawXml) as ParsedFeed;
  const rssItems = parsed?.rss?.channel?.item as ParsedItem | ParsedItem[] | undefined;
  const atomItems = parsed?.feed?.entry as ParsedItem | ParsedItem[] | undefined;
  const items = ensureArray<ParsedItem>(rssItems).concat(ensureArray<ParsedItem>(atomItems));

  return items.map((item, index) => {
    const title = getText(item.title) || 'Untitled';
    const link = getLink(item);
    const pubDate = getText(item.pubDate) || getText(item.updated) || getText(item.published);
    const categoryTag = getText(item.category) || getText(item['dc:subject']);
    const description = getText(item.description) || getText(item.summary) || getText(item.content);
    const summary = description ? summarizeText(description) : 'No summary available.';
    const slug = link ? link.split('/').filter(Boolean).pop() || `item-${index}` : `item-${index}`;
    const status = config.category === 'Outage' ? normalizeStatus(`${title} ${description}`) : undefined;

    return {
      id: `${config.url}-${index}`,
      slug,
      title,
      category: config.category,
      subcategory: config.subcategory || categoryTag || 'Feed',
      severity: config.category === 'Outage' ? undefined : 'Medium',
      summary,
      impact: config.category === 'Outage' ? 'Service disruption or outage event reported.' : 'Review the update details and guidance.',
      recommended_action:
        config.category === 'Outage'
          ? 'Check the service health details and follow mitigation guidance.'
          : 'Read the blog post for update guidance and deployment notes.',
      source_name: config.sourceName,
      source_url: link,
      published_at: pubDate || new Date().toISOString(),
      status,
      tags: categoryTag ? [categoryTag] : [],
    };
  });
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const allItems: AlertItem[] = [];

  for (const config of feedConfigs) {
    try {
      const response = await fetch(config.url);
      if (!response.ok) {
        console.error(`Feed fetch failed for ${config.url}: ${response.status}`);
        continue;
      }

      const xml = await response.text();
      allItems.push(...parseFeed(xml, config));
    } catch (error) {
      console.error(`Error fetching feed ${config.url}:`, error);
    }
  }

  // Load custom incidents from public/data/incidents.json
  await loadCustomIncidents();

  // Filter out low-quality feed content
  const filtered = filterLowQualityContent(allItems);

  // Merge with Downdetector-style custom data
  const merged = mergeDowndetectorData(filtered);

  return merged.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

// Fallback static data for development
export const alerts: AlertItem[] = [
  {
    id: '1',
    slug: 'windows-update-vpn-failures-kb507001',
    title: 'Windows Update Causing VPN Failures in Enterprise Networks',
    category: 'Microsoft Update',
    subcategory: 'Windows',
    severity: 'High',
    summary:
      'Reports indicate KB507001 can interrupt split-tunnel VPN connectivity for domain-joined endpoints.',
    impact:
      'Remote employees may lose access to internal resources and line-of-business applications.',
    recommended_action:
      'Pause broad deployment, scope impacted VPN profiles, and test mitigation policy before resuming rollout.',
    source_name: 'Makriva Intelligence Desk',
    source_url: 'https://makriva.example/sources/windows-kb507001',
    published_at: '2026-04-10T14:20:00Z',
    tags: ['Windows 11', 'Patch Tuesday', 'VPN']
  },
  // Add more items as needed
];

export async function getAlertBySlug(slug: string): Promise<AlertItem | undefined> {
  const normalizedSlug = decodeURIComponent(slug).replace(/\/+/g, '/').replace(/\/$/, '');
  const matchesSlug = (item: AlertItem) => {
    const itemSlug = decodeURIComponent(item.slug).replace(/\/+/g, '/').replace(/\/$/, '');
    return itemSlug === normalizedSlug;
  };

  const dynamicAlerts = await fetchAlerts();
  return dynamicAlerts.find(matchesSlug) || alerts.find(matchesSlug);
}
