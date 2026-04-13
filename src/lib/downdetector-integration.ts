import { AlertItem } from '@/types/alert';

/**
 * Downdetector Integration Reference
 * 
 * This module provides helper utilities and mock data for Downdetector-style outage tracking.
 * Downdetector doesn't have a public API, but we can:
 * 
 * 1. Aggregate real service status feeds (Azure, AWS, GitHub, Slack, etc.)
 * 2. Parse Downdetector's publicly available status pages using scraping
 * 3. Maintain manual feeds of popular outages
 * 
 * The main outage data is currently sourced from:
 * - Azure Status Feed
 * - AWS Health Dashboard (RSS)
 * - GitHub Status Feed
 * - Slack Status Feed
 */

export const downdetectorMockData: AlertItem[] = [
  {
    id: 'dd-meta-001',
    slug: 'meta-services-outage-2026-04-09',
    title: 'Meta Services Global Outage',
    category: 'Outage',
    subcategory: 'Meta (Facebook, Instagram, WhatsApp)',
    severity: 'Critical',
    summary:
      'Widespread outage affecting Meta services globally. Users unable to access Facebook, Instagram, and Messenger. Estimated 100M+ users impacted.',
    impact:
      'All Meta services (Facebook, Instagram, Messenger, WhatsApp) experiencing severe availability issues. Users unable to send messages, upload content, or access feeds.',
    recommended_action:
      'Check Meta status page for updates. Avoid critical communications via Meta platforms. Use alternative messaging services.',
    source_name: 'Downdetector (Community Reports)',
    source_url: 'https://downdetector.com/status/facebook/',
    published_at: '2026-04-09T14:32:00Z',
    status: 'Resolved',
    tags: ['Facebook', 'Instagram', 'Messenger', 'WhatsApp', 'Meta'],
  },
  {
    id: 'dd-google-002',
    slug: 'google-services-partial-outage-2026-04-08',
    title: 'Google Cloud Services Partial Outage',
    category: 'Outage',
    subcategory: 'Google Cloud',
    severity: 'High',
    summary:
      'Google Cloud experiencing intermittent connectivity issues affecting GCP services in US-Central region. Performance degradation reported.',
    impact:
      'GCP services in us-central1 region experiencing 5-15% packet loss. Affected services: Compute Engine, Cloud Storage, Cloud SQL.',
    recommended_action:
      'Failover workloads to alternate regions. Monitor Google Cloud Status dashboard for updates.',
    source_name: 'Downdetector (Community Reports)',
    source_url: 'https://downdetector.com/status/google-cloud/',
    published_at: '2026-04-08T09:15:00Z',
    status: 'Monitoring',
    tags: ['Google Cloud', 'GCP', 'Compute', 'Storage'],
  }
];

/**
 * To add Downdetector as a full data source:
 * 
 * Option 1: Manual Feed Updates
 * - Update downdetectorMockData periodically with real incidents
 * - Track status updates through Downdetector website
 * 
 * Option 2: Community Data Integration
 * - Integrate with service status pages that aggregate Downdetector reports
 * - Use Statuspage.io feeds where available
 * 
 * Option 3: API Integration (if Downdetector provides one)
 * - Add API endpoint to feedConfigs
 * - Parse JSON responses instead of XML
 */

/**
 * Helper function to merge Downdetector data with feed data
 */
export function mergeDowndetectorData(feedAlerts: AlertItem[]): AlertItem[] {
  // Filter out resolved incidents older than 24 hours
  const recentDowndetector = downdetectorMockData.filter((item) => {
    if (item.status === 'Resolved') {
      const age = Date.now() - new Date(item.published_at).getTime();
      return age < 24 * 60 * 60 * 1000; // Keep for 24 hours
    }
    return true; // Keep active incidents
  });

  // Combine and deduplicate by title
  const combined = [...feedAlerts, ...recentDowndetector];
  const seen = new Set<string>();
  return combined.filter((alert) => {
    if (seen.has(alert.title)) return false;
    seen.add(alert.title);
    return true;
  });
}
