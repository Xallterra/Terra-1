import { alerts } from '@/lib/alerts-data';
import { AlertCard } from '@/components/alerts/alert-card';

export function LatestAlerts() {
  const latest = [...alerts].sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at)).slice(0, 4);

  return (
    <section className="page-section" style={{ paddingTop: 0 }}>
      <div className="container" style={{ display: 'grid', gap: '1rem' }}>
        <h2 style={{ marginBottom: 0 }}>Latest Alerts</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {latest.map((item) => (
            <AlertCard key={item.id} alert={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
