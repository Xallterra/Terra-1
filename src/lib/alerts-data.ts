import Parser from 'rss-parser';
import { AlertItem } from '@/types/alert';

const parser = new Parser();

export async function fetchAlerts(): Promise<AlertItem[]> {
  // Example RSS feeds - replace with actual feeds
  const feeds = [
    'https://www.cisa.gov/cybersecurity-advisories/all.xml', // CISA alerts
    'https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss.xml', // NVD CVEs
    'https://www.microsoft.com/en-us/security/blog/feed/', // Microsoft Security Blog
  ];

  const allItems: AlertItem[] = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      feed.items?.forEach((item, index) => {
        allItems.push({
          id: `${feedUrl}-${index}`,
          slug: item.link?.split('/').pop() || `item-${index}`,
          title: item.title || 'Untitled',
          category: 'Vulnerability', // Map based on feed
          subcategory: 'CVE',
          severity: 'Medium', // Parse from content if possible
          summary: item.contentSnippet || item.summary || '',
          impact: 'TBD', // Parse from content
          recommended_action: 'Review and apply patches',
          source_name: feed.title || 'External Feed',
          source_url: item.link || '',
          published_at: item.pubDate || new Date().toISOString(),
          tags: item.categories || [],
        });
      });
    } catch (error) {
      console.error(`Error fetching feed ${feedUrl}:`, error);
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
