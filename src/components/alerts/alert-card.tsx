import Link from 'next/link';
import { AlertItem } from '@/types/alert';
import { SeverityBadge } from './severity-badge';
import { StatusBadge } from './status-badge';

function getCategoryBadgeStyle(category: string): { borderColor: string; background: string; color: string } {
  switch (category.toLowerCase()) {
    case 'vulnerability':
    case 'security advisory':
      return { borderColor: '#7c2d12', background: '#4c1d12', color: '#fed7aa' }; // Orange-red
    case 'outage':
      return { borderColor: '#7c2d12', background: '#7f1d1d', color: '#fecaca' }; // Red
    case 'microsoft update':
      return { borderColor: '#1e40af', background: '#1e3a8a', color: '#93c5fd' }; // Blue
    default:
      return { borderColor: '#32508b', background: '#142444', color: '#b8cffd' }; // Default blue
  }
}

export function AlertCard({ alert }: { alert: AlertItem }) {
  const date = new Date(alert.published_at).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const badgeStyle = getCategoryBadgeStyle(alert.category);

  return (
    <article className="card" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span className="badge" style={{ borderColor: badgeStyle.borderColor, background: badgeStyle.background, color: badgeStyle.color }}>
          {alert.category}
        </span>
        {alert.severity && <SeverityBadge severity={alert.severity} />}
        {alert.status && <StatusBadge status={alert.status} />}
      </div>
      <h3 style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.4 }}>{alert.title}</h3>
      <p style={{ margin: 0, color: '#a2b2cd', fontSize: '0.95rem' }}>{alert.summary}</p>
      <p style={{ margin: 0, color: '#8798b7', fontSize: '0.82rem' }}>{date}</p>
      <Link href={`/alerts/${alert.slug}`} style={{ color: '#7fc0ff', fontWeight: 600, fontSize: '0.92rem' }}>
        View full alert details →
      </Link>
    </article>
  );
}
