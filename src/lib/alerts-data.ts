import { AlertItem } from '@/types/alert';

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
  {
    id: '2',
    slug: 'critical-cve-enterprise-auth-bypass',
    title: 'New Critical CVE Enables Authentication Bypass on Exposed Gateways',
    category: 'Vulnerability',
    subcategory: 'CVE',
    severity: 'Critical',
    summary:
      'A newly disclosed vulnerability chain allows remote attackers to bypass authentication under specific configurations.',
    impact:
      'Internet-facing appliances may be susceptible to initial compromise and lateral movement.',
    recommended_action:
      'Apply vendor emergency patch, block vulnerable endpoints externally, and hunt for IOC patterns immediately.',
    source_name: 'Makriva Threat Watch',
    source_url: 'https://makriva.example/sources/cve-critical-april',
    published_at: '2026-04-11T08:05:00Z',
    tags: ['CVE', 'Zero-Day', 'Perimeter Security']
  },
  {
    id: '3',
    slug: 'microsoft-365-authentication-outage',
    title: 'Microsoft 365 Outage Impacting Authentication Flows',
    category: 'Outage',
    subcategory: 'Microsoft 365',
    summary:
      'Multiple tenants are experiencing intermittent login failures in web and desktop clients.',
    impact:
      'Users may be unable to sign in to Exchange Online and Teams during peak business hours.',
    recommended_action:
      'Switch to business continuity channels, monitor tenant health dashboard, and notify service desk teams.',
    source_name: 'Makriva Service Monitor',
    source_url: 'https://makriva.example/sources/m365-auth-incident',
    published_at: '2026-04-11T09:45:00Z',
    status: 'Monitoring',
    tags: ['M365', 'Authentication', 'Tenant Impact']
  },
  {
    id: '4',
    slug: 'intune-service-disruption-device-compliance',
    title: 'Intune Service Disruption Delays Device Compliance Sync',
    category: 'Outage',
    subcategory: 'Intune',
    summary:
      'Policy and compliance status updates are delayed for managed Windows and mobile endpoints.',
    impact:
      'New device enrollments and policy enforcement workflows may be temporarily inconsistent.',
    recommended_action:
      'Delay high-risk compliance-based access changes and monitor endpoint drift until full restoration.',
    source_name: 'Makriva Service Monitor',
    source_url: 'https://makriva.example/sources/intune-sync-disruption',
    published_at: '2026-04-09T18:00:00Z',
    status: 'Identified',
    tags: ['Intune', 'Compliance', 'Endpoint']
  },
  {
    id: '5',
    slug: 'defender-signature-false-positives-april',
    title: 'Defender Signature Update Triggering False Positives',
    category: 'Security Advisory',
    subcategory: 'Defender',
    severity: 'Medium',
    summary:
      'Recent Defender definitions may incorrectly quarantine approved internal automation tooling.',
    impact:
      'Automated jobs could fail where signed tools are quarantined, affecting patching and deployment operations.',
    recommended_action:
      'Roll back to prior signature baseline in sensitive environments and create temporary allow indicators.',
    source_name: 'Makriva Intelligence Desk',
    source_url: 'https://makriva.example/sources/defender-fp-april',
    published_at: '2026-04-08T12:40:00Z',
    tags: ['Defender', 'False Positive', 'SOC']
  },
  {
    id: '6',
    slug: 'azure-admin-portal-incident',
    title: 'Azure Incident Affecting Admin Portal Availability',
    category: 'Outage',
    subcategory: 'Azure',
    summary:
      'Administrators report intermittent errors while accessing subscription and identity management blades.',
    impact:
      'Infrastructure changes, IAM updates, and emergency policy operations may be delayed.',
    recommended_action:
      'Use CLI/API fallback paths where possible and postpone non-critical admin operations until resolved.',
    source_name: 'Makriva Service Monitor',
    source_url: 'https://makriva.example/sources/azure-admin-incident',
    published_at: '2026-04-07T20:15:00Z',
    status: 'Investigating',
    tags: ['Azure', 'Portal', 'Identity']
  },
  {
    id: '7',
    slug: 'open-source-package-supply-chain-warning',
    title: 'Supply Chain Warning: Popular Package Maintainer Account Compromised',
    category: 'Tech Alert',
    subcategory: 'Supply Chain',
    severity: 'High',
    summary:
      'Security researchers identified malicious package updates from a compromised maintainer account.',
    impact:
      'Build pipelines that auto-pull latest versions may ingest trojanized dependencies.',
    recommended_action:
      'Pin known-good versions, rotate build credentials, and execute integrity scans across recent artifacts.',
    source_name: 'Makriva Threat Watch',
    source_url: 'https://makriva.example/sources/supply-chain-warning',
    published_at: '2026-04-11T03:10:00Z',
    tags: ['DevSecOps', 'Supply Chain', 'Malware']
  }
];

export const getAlertBySlug = (slug: string) => alerts.find((item) => item.slug === slug);
