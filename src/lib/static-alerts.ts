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
    id: 'seed-cisa-cve-2025-53770',
    slug: 'cisa-kev-cve-2025-53770',
    title: 'CVE-2025-53770: Microsoft SharePoint Server remote code execution vulnerability',
    category: 'Vulnerability',
    subcategory: 'Microsoft / SharePoint Server',
    severity: 'Critical',
    summary:
      'Known exploited SharePoint Server vulnerability requiring urgent mitigation, exposure review, and patch validation.',
    impact:
      'Publicly exposed SharePoint farms may be vulnerable to remote code execution and follow-on compromise if not remediated.',
    recommended_action:
      'Apply Microsoft security updates, rotate affected secrets where advised, review IIS/SharePoint logs, and prioritize internet-facing systems.',
    source_name: 'Makriva Vulnerability Seed',
    source_url: 'https://nvd.nist.gov/vuln/detail/CVE-2025-53770',
    published_at: '2025-07-20T12:00:00Z',
    tags: ['CVE-2025-53770', 'Microsoft', 'SharePoint', 'RCE', 'CISA KEV']
  },
  {
    id: 'seed-cisa-cve-2024-3400',
    slug: 'cisa-kev-cve-2024-3400',
    title: 'CVE-2024-3400: Palo Alto PAN-OS command injection vulnerability',
    category: 'Vulnerability',
    subcategory: 'Palo Alto Networks / PAN-OS',
    severity: 'Critical',
    summary:
      'Known exploited PAN-OS command injection vulnerability affecting firewall management and GlobalProtect deployments.',
    impact:
      'Threat actors may execute commands on affected appliances, enabling persistence, data access, or lateral movement.',
    recommended_action:
      'Apply vendor fixes, restrict management exposure, hunt for indicators of compromise, and review device configuration changes.',
    source_name: 'Makriva Vulnerability Seed',
    source_url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-3400',
    published_at: '2024-04-12T12:00:00Z',
    tags: ['CVE-2024-3400', 'Palo Alto', 'PAN-OS', 'Command Injection', 'CISA KEV']
  },
  {
    id: 'seed-cisa-cve-2023-34362',
    slug: 'cisa-kev-cve-2023-34362',
    title: 'CVE-2023-34362: MOVEit Transfer SQL injection vulnerability',
    category: 'Vulnerability',
    subcategory: 'Progress / MOVEit Transfer',
    severity: 'Critical',
    summary:
      'Known exploited MOVEit Transfer SQL injection vulnerability associated with data theft campaigns.',
    impact:
      'Exploitation can expose sensitive managed file transfer data and may require incident response beyond patching.',
    recommended_action:
      'Patch immediately, follow vendor IR guidance, review file transfer logs, rotate credentials, and notify impacted data owners.',
    source_name: 'Makriva Vulnerability Seed',
    source_url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-34362',
    published_at: '2023-06-02T12:00:00Z',
    tags: ['CVE-2023-34362', 'MOVEit', 'SQL Injection', 'Data Exfiltration', 'CISA KEV']
  },
  {
    id: 'seed-cisa-cve-2021-44228',
    slug: 'cisa-kev-cve-2021-44228',
    title: 'CVE-2021-44228: Apache Log4j remote code execution vulnerability',
    category: 'Vulnerability',
    subcategory: 'Apache / Log4j',
    severity: 'Critical',
    summary:
      'Log4Shell remains a high-priority enterprise exposure because vulnerable Java dependencies can persist in applications and appliances.',
    impact:
      'Unauthenticated remote code execution can lead to application takeover, credential theft, and lateral movement.',
    recommended_action:
      'Inventory Java applications, update Log4j, apply mitigations for embedded appliances, and continue detection for exploit traffic.',
    source_name: 'Makriva Vulnerability Seed',
    source_url: 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228',
    published_at: '2021-12-10T12:00:00Z',
    tags: ['CVE-2021-44228', 'Apache', 'Log4j', 'RCE', 'CISA KEV']
  },
];
