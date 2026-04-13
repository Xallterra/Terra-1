import { notFound } from 'next/navigation';
import { getAlertBySlug } from '@/lib/alerts-data';
import { SeverityBadge } from '@/components/alerts/severity-badge';
import { StatusBadge } from '@/components/alerts/status-badge';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function AlertDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const alert = await getAlertBySlug(slug);

  if (!alert) notFound();

  return (
    <section className="page-section">
      <div className="container card" style={{ padding: '1.8rem', display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge" style={{ borderColor: '#32508b', background: '#142444', color: '#b8cffd' }}>
            {alert.category}
          </span>
          {alert.severity && <SeverityBadge severity={alert.severity} />}
          {alert.status && <StatusBadge status={alert.status} />}
        </div>
        <h1 style={{ margin: 0 }}>{alert.title}</h1>
        <p style={{ margin: 0, color: '#9fb0ce' }}>{alert.summary}</p>
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.4rem' }}>Impact</h3>
            <p style={{ margin: 0, color: '#b3c1da' }}>{alert.impact}</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '0.4rem' }}>Recommended Action</h3>
            <p style={{ margin: 0, color: '#b3c1da' }}>{alert.recommended_action}</p>
          </div>
        </div>
        <div style={{ color: '#8ea0be', fontSize: '0.92rem', display: 'grid', gap: '0.3rem' }}>
          <span>Published: {new Date(alert.published_at).toLocaleString('en-US')}</span>
          <span>
            Source: <a href={alert.source_url} target="_blank">{alert.source_name}</a>
          </span>
          <span>Tags: {alert.tags.join(', ')}</span>
        </div>
      </div>
    </section>
  );
}
