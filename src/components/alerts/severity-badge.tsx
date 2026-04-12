import type { CSSProperties } from 'react';
import { Severity } from '@/types/alert';

const styles: Record<Severity, CSSProperties> = {
  Critical: { background: 'rgba(239, 94, 106, 0.12)', borderColor: '#ef5e6a', color: '#ffb8bf' },
  High: { background: 'rgba(231, 165, 59, 0.14)', borderColor: '#e7a53b', color: '#ffd39a' },
  Medium: { background: 'rgba(112, 145, 255, 0.14)', borderColor: '#6e8fff', color: '#c7d4ff' },
  Low: { background: 'rgba(74, 163, 255, 0.12)', borderColor: '#4aa3ff', color: '#a7d3ff' }
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className="badge" style={styles[severity]}>Severity: {severity}</span>;
}
