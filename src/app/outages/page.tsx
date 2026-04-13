import { PageHero } from '@/components/shared/page-hero';
import { AlertCard } from '@/components/alerts/alert-card';
import { EmptyState } from '@/components/shared/empty-state';
import { fetchAlerts } from '@/lib/alerts-data';

const rank = { Investigating: 4, Identified: 3, Monitoring: 2, Resolved: 1 } as const;

export const revalidate = 300;

export default async function OutagesPage() {
  const alerts = await fetchAlerts();
  const items = alerts
    .filter((item) => item.category === 'Outage')
    .sort((a, b) => (rank[b.status ?? 'Resolved'] ?? 0) - (rank[a.status ?? 'Resolved'] ?? 0));

  return (
    <>
      <PageHero title="Outages" subtitle="Service incident and disruption tracking with status visibility for operational response teams." />
      <section className="container page-section" style={{ paddingTop: 0 }}>
        {items.length === 0 ? (
          <EmptyState title="No active outage records" description="Outage alerts appear here with lifecycle status from investigating through resolved." />
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {items.map((item) => (
              <AlertCard key={item.id} alert={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
