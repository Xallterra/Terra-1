import { AlertItem, OutageStatus } from '@/types/alert';

interface OutageStats {
  total: number;
  investigating: number;
  identified: number;
  monitoring: number;
  resolved: number;
  avgResolutionTime: string;
}

export function calculateOutageStats(outages: AlertItem[]): OutageStats {
  const stats = {
    total: outages.length,
    investigating: outages.filter((o) => o.status === 'Investigating').length,
    identified: outages.filter((o) => o.status === 'Identified').length,
    monitoring: outages.filter((o) => o.status === 'Monitoring').length,
    resolved: outages.filter((o) => o.status === 'Resolved').length,
    avgResolutionTime: '2-4 hours',
  };

  return stats;
}

export function getStatusColor(status?: OutageStatus): string {
  switch (status) {
    case 'Investigating':
      return '#fbbf24'; // Amber
    case 'Identified':
      return '#f97316'; // Orange
    case 'Monitoring':
      return '#3b82f6'; // Blue
    case 'Resolved':
      return '#10b981'; // Green
    default:
      return '#6b7280'; // Gray
  }
}

export function getStatusIcon(status?: OutageStatus): string {
  switch (status) {
    case 'Investigating':
      return '🔍';
    case 'Identified':
      return '⚠️';
    case 'Monitoring':
      return '📡';
    case 'Resolved':
      return '✅';
    default:
      return '❓';
  }
}

export function getAffectedServicesFromOutages(outages: AlertItem[]): string[] {
  const services = new Set<string>();
  outages.forEach((outage) => {
    // Extract service names from title and tags
    outage.tags.forEach((tag) => services.add(tag));
    if (outage.subcategory && outage.subcategory !== 'Feed') {
      services.add(outage.subcategory);
    }
  });
  return Array.from(services).filter((s) => s.length > 0);
}
