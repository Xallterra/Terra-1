import type { CSSProperties } from 'react';
import { OutageStatus } from '@/types/alert';

const styles: Record<OutageStatus, CSSProperties> = {
  Investigating: { background: 'rgba(231, 165, 59, 0.16)', borderColor: '#e7a53b', color: '#f8dba8' },
  Identified: { background: 'rgba(114, 125, 255, 0.14)', borderColor: '#7582ff', color: '#d1d5ff' },
  Monitoring: { background: 'rgba(53, 167, 255, 0.14)', borderColor: '#4aa3ff', color: '#b8dcff' },
  Resolved: { background: 'rgba(35, 178, 109, 0.16)', borderColor: '#23b26d', color: '#b9f0d4' }
};

export function StatusBadge({ status }: { status: OutageStatus }) {
  return <span className="badge" style={styles[status]}>Status: {status}</span>;
}
