export type AlertCategory =
  | 'Vulnerability'
  | 'Microsoft Update'
  | 'Outage'
  | 'Security Advisory'
  | 'Tech Alert';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type OutageStatus = 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';

export type AlertItem = {
  id: string;
  slug: string;
  title: string;
  category: AlertCategory;
  subcategory: string;
  severity?: Severity;
  summary: string;
  impact: string;
  recommended_action: string;
  source_name: string;
  source_url: string;
  published_at: string;
  status?: OutageStatus;
  tags: string[];
};
