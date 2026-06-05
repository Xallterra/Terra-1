import { cache } from 'react';

import { AlertItem, AlertCategory, OutageStatus } from '@/types/alert';
import { XMLParser } from 'fast-xml-parser';
import { mergeDowndetectorData, loadCustomIncidents, filterLowQualityContent } from './downdetector-integration';
import { alerts } from './static-alerts';
import { formatAlertText, summarizeAlertText } from './alert-text';

type FeedConfig = {
  url: string;
  category: AlertCategory;
  subcategory: string;
  sourceName: string;
};

type CisaKevEntry = {
  cveID?: string;
  cveName?: string;
  vendorProject?: string;
  product?: string;
  vulnerabilityName?: string;
  dateAdded?: string;
  shortDescription?: string;
  requiredAction?: string;
  dueDate?: string;
  knownRansomwareCampaignUse?: string;
  notes?: string;
  cwes?: string[];
};

type CisaKevCatalog = {
  title?: string;
  catalogVersion?: string;
  dateReleased?: string;
  count?: number;
  vulnerabilities?: CisaKevEntry[];
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
  processEntities: false,
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

function getText(value: unknown): string {
  const rawText = normalizeText(value);
  return formatAlertText(rawText);
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
  return summarizeAlertText(text, maxLength);
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

async function fetchFeed(config: FeedConfig): Promise<AlertItem[]> {
  try {
    const response = await fetch(config.url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(`Feed fetch failed for ${config.url}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    return parseFeed(xml, config);
  } catch (error) {
    console.error(`Error fetching feed ${config.url}:`, error);
    return [];
  }
}

function inferVulnerabilitySeverity(entry: CisaKevEntry): AlertItem['severity'] {
  const text = `${entry.vulnerabilityName ?? ''} ${entry.shortDescription ?? ''} ${entry.requiredAction ?? ''}`.toLowerCase();
  if ((entry.knownRansomwareCampaignUse ?? '').toLowerCase() === 'known') return 'Critical';
  if (/remote code execution|rce|command injection|deserialization|authentication bypass|zero.?day/i.test(text)) return 'Critical';
  if (/privilege escalation|bypass|path traversal|sql injection|xss|memory corruption/i.test(text)) return 'High';
  return 'High';
}

function cisaKevToAlert(entry: CisaKevEntry, index: number): AlertItem {
  const cve = entry.cveID ?? entry.cveName ?? `CVE-unknown-${index}`;
  const vendor = entry.vendorProject ?? 'Unknown vendor';
  const product = entry.product ?? 'Unknown product';
  const title = `${cve}: ${entry.vulnerabilityName ?? `${vendor} ${product} exploited vulnerability`}`;
  const publishedAt = entry.dateAdded ? new Date(entry.dateAdded).toISOString() : new Date().toISOString();
  const ransomware = entry.knownRansomwareCampaignUse ? ` Ransomware campaign use: ${entry.knownRansomwareCampaignUse}.` : '';
  const dueDate = entry.dueDate ? ` Federal remediation due date: ${entry.dueDate}.` : '';

  return {
    id: `cisa-kev-${cve}`,
    slug: `cisa-kev-${cve.toLowerCase()}`,
    title,
    category: 'Vulnerability',
    subcategory: `${vendor} / ${product}`,
    severity: inferVulnerabilitySeverity(entry),
    summary: summarizeText(entry.shortDescription || `${vendor} ${product} vulnerability listed in CISA Known Exploited Vulnerabilities catalog.`),
    impact: `CISA lists ${cve} as known exploited in the wild for ${vendor} ${product}.${ransomware}${dueDate}`,
    recommended_action:
      entry.requiredAction ||
      'Prioritize remediation according to CISA KEV guidance, vendor advisories, exposure, exploitability, and business criticality.',
    source_name: 'CISA Known Exploited Vulnerabilities Catalog',
    source_url: `https://nvd.nist.gov/vuln/detail/${encodeURIComponent(cve)}`,
    published_at: publishedAt,
    tags: [cve, vendor, product, 'CISA KEV', ...(entry.cwes ?? [])].filter(Boolean),
  };
}

async function fetchCisaKevVulnerabilities(): Promise<AlertItem[]> {
  try {
    const response = await fetch('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json', {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(`CISA KEV fetch failed: ${response.status}`);
      return [];
    }

    const catalog = (await response.json()) as CisaKevCatalog;
    return (catalog.vulnerabilities ?? []).slice(0, 80).map(cisaKevToAlert);
  } catch (error) {
    console.error('Error fetching CISA KEV vulnerabilities:', error);
    return [];
  }
}

function deduplicateAlerts(items: AlertItem[]): AlertItem[] {
  const seen = new Set<string>();
  const deduped: AlertItem[] = [];

  for (const item of items) {
    const key = item.slug || item.id;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}

export const fetchAlerts = cache(async (): Promise<AlertItem[]> => {
  const [feedResults, kevItems] = await Promise.all([
    Promise.all(feedConfigs.map((config) => fetchFeed(config))),
    fetchCisaKevVulnerabilities(),
  ]);
  const allItems = [...feedResults.flat(), ...kevItems, ...alerts];

  // Load custom incidents from public/data/incidents.json
  await loadCustomIncidents();

  // Filter out low-quality feed content
  const filtered = filterLowQualityContent(allItems);

  // Merge with Downdetector-style custom data
  const merged = mergeDowndetectorData(filtered);

  return deduplicateAlerts(merged).sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
});

export async function getAlertBySlug(slug: string): Promise<AlertItem | undefined> {
  const normalizedSlug = decodeURIComponent(slug).replace(/\/+/g, '/').replace(/\/$/, '');
  const matchesSlug = (item: AlertItem) => {
    const itemSlug = decodeURIComponent(item.slug).replace(/\/+/g, '/').replace(/\/$/, '');
    return itemSlug === normalizedSlug;
  };

  const dynamicAlerts = await fetchAlerts();
  return dynamicAlerts.find(matchesSlug) || alerts.find(matchesSlug);
}
