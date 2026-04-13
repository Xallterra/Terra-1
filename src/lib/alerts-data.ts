import { AlertItem, AlertCategory, OutageStatus } from '@/types/alert';
import { XMLParser } from 'fast-xml-parser';

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
];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  ignoreDeclaration: true,
  trimValues: true,
});

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function getText(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value['#text'] || value['@_value'] || '';
}

function getLink(item: any): string {
  if (!item) return '';
  if (typeof item.link === 'string') return item.link;
  if (item.link?.href) return item.link.href;
  if (item.link?.['@_href']) return item.link['@_href'];
  if (Array.isArray(item.link)) {
    const alternate = item.link.find((l: any) => l['@_rel'] === 'alternate' || l.rel === 'alternate');
    return alternate?.href || alternate?.['@_href'] || getText(item.link[0]);
  }
  return getText(item.link);
}

function normalizeStatus(text: string): OutageStatus {
  if (/investigating/i.test(text)) return 'Investigating';
  if (/identified/i.test(text)) return 'Identified';
  if (/monitoring/i.test(text)) return 'Monitoring';
  return 'Resolved';
}

function parseFeed(rawXml: string, config: FeedConfig): AlertItem[] {
  const parsed = xmlParser.parse(rawXml);
  const rssItems = parsed?.rss?.channel?.item;
  const atomItems = parsed?.feed?.entry;
  const items = ensureArray(rssItems).concat(ensureArray(atomItems));

  return items.map((item: any, index: number) => {
    const title = getText(item.title) || 'Untitled';
    const link = getLink(item);
    const pubDate = getText(item.pubDate) || getText(item.updated) || getText(item.published);
    const categoryTag = getText(item.category) || getText(item['dc:subject']);
    const description = getText(item.description) || getText(item.summary) || getText(item.content);
    const slug = link ? link.split('/').filter(Boolean).pop() || `item-${index}` : `item-${index}`;
    const status = config.category === 'Outage' ? normalizeStatus(`${title} ${description}`) : undefined;

    return {
      id: `${config.url}-${index}`,
      slug,
      title,
      category: config.category,
      subcategory: config.subcategory || categoryTag || 'Feed',
      severity: config.category === 'Outage' ? undefined : 'Medium',
      summary: description || 'No summary available.',
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

  return allItems.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
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

export const getAlertBySlug = (slug: string) => alerts.find((item) => item.slug === slug);
