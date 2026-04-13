import { AlertItem } from '@/types/alert';

/**
 * Downdetector Integration Reference
 * 
 * This module provides helper utilities and customizable incident data.
 * Downdetector doesn't have a public API, but we can:
 * 
 * 1. Aggregate real service status feeds (Azure, AWS, GitHub, Slack, etc.)
 * 2. Load custom incidents from public/data/incidents.json
 * 3. Parse Downdetector's publicly available status pages using scraping
 * 4. Maintain manageable incident feeds
 * 
 * The main outage data is currently sourced from:
 * - Azure Status Feed
 * - AWS Health Dashboard (RSS)
 * - GitHub Status Feed
 * - Slack Status Feed
 * - Custom incidents from public/data/incidents.json
 */

let customIncidents: AlertItem[] = [];

/**
 * Load custom incidents from public/data/incidents.json
 * This allows non-technical users to add/update incidents without code changes
 */
export async function loadCustomIncidents(): Promise<AlertItem[]> {
  try {
    const response = await fetch('/data/incidents.json');
    if (!response.ok) {
      console.warn('Could not load custom incidents data');
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data.incidents)) {
      console.warn('Invalid incidents data format');
      return [];
    }

    // Filter out resolved incidents older than 24 hours
    const now = Date.now();
    customIncidents = data.incidents.filter((item: AlertItem) => {
      if (item.status === 'Resolved') {
        const age = now - new Date(item.published_at).getTime();
        return age < 24 * 60 * 60 * 1000; // Keep for 24 hours
      }
      return true; // Keep active incidents
    });

    return customIncidents;
  } catch (error) {
    console.error('Error loading custom incidents:', error);
    return [];
  }
}

/**
 * Helper function to merge custom incident data with feed data
 */
export function mergeDowndetectorData(feedAlerts: AlertItem[]): AlertItem[] {
  // Combine and deduplicate by title + source
  const combined = [...feedAlerts, ...customIncidents];
  const seen = new Set<string>();

  return combined.filter((alert) => {
    const key = `${alert.title}|${alert.source_name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Filter low-quality feed content
 */
export function filterLowQualityContent(alerts: AlertItem[]): AlertItem[] {
  return alerts.filter((alert) => {
    // Skip if title is too short or generic
    if (!alert.title || alert.title.length < 5) return false;
    if (/untitled|no title|unknown|test|demo/i.test(alert.title)) return false;

    // Skip if summary is missing or too short
    if (!alert.summary || alert.summary.length < 10) return false;
    if (alert.summary === 'No summary available.') {
      console.debug(`Filtered low-quality alert: ${alert.title}`);
      return false;
    }

    // Skip duplicates with exact same content
    if (alert.summary.includes('...placeholder') || alert.summary.includes('...')) {
      // Only skip if it's obviously truncated with no real content
      return alert.summary.length > 50;
    }

    return true;
  });
}
