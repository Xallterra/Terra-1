import type { CSSProperties } from 'react';
import { OutageStatus } from '@/types/alert';

const styles: Record<OutageStatus, CSSProperties> = {
  Investigating: {
    background: 'rgba(255, 214, 10, 0.15)',
    borderColor: '#ffd60a',
    color: '#ffea44',
    textShadow: '0 0 8px rgba(255, 214, 10, 0.4)',
  },
  Identified: {
    background: 'rgba(255, 107, 53, 0.15)',
    borderColor: '#ff6b35',
    color: '#ff9966',
    textShadow: '0 0 8px rgba(255, 107, 53, 0.4)',
  },
  Monitoring: {
    background: 'rgba(0, 153, 255, 0.15)',
    borderColor: '#0099ff',
    color: '#44ccff',
    textShadow: '0 0 8px rgba(0, 153, 255, 0.4)',
  },
  Resolved: {
    background: 'rgba(57, 255, 20, 0.15)',
    borderColor: '#39ff14',
    color: '#66ff44',
    textShadow: '0 0 8px rgba(57, 255, 20, 0.4)',
  },
};

export function StatusBadge({ status }: { status: OutageStatus }) {
  const statusIcons = {
    Investigating: 'SCAN',
    Identified: 'WARN',
    Monitoring: 'MON',
    Resolved: 'OK',
  };

  return (
    <span
      style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        border: `1px solid`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        transition: 'all 0.3s ease-out',
        ...styles[status],
      }}
    >
      {statusIcons[status]} {status}
    </span>
  );
}
