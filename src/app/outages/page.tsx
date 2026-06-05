import { PageHero } from '@/components/shared/page-hero';
import { AlertCard } from '@/components/alerts/alert-card';
import { EmptyState } from '@/components/shared/empty-state';
import { OutageStatusDashboard } from '@/components/outages/outage-status-dashboard';
import { OutageTimeline } from '@/components/outages/outage-timeline';
import { fetchAlerts } from '@/lib/alerts-data';
import type { AlertItem, OutageStatus } from '@/types/alert';

const rank = { Investigating: 4, Identified: 3, Monitoring: 2, Resolved: 1 } as const;
const validStatuses: OutageStatus[] = ['Investigating', 'Identified', 'Monitoring', 'Resolved'];

type OutagesSearchParams = {
  service?: string;
  status?: string;
};

function matchesService(item: AlertItem, service?: string) {
  if (!service) return true;
  const normalizedService = service.toLowerCase();
  return (
    item.subcategory?.toLowerCase() === normalizedService ||
    item.tags.some((tag) => tag.toLowerCase() === normalizedService)
  );
}

export const revalidate = 300;

export default async function OutagesPage({ searchParams }: { searchParams: Promise<OutagesSearchParams> }) {
  const params = await searchParams;
  const selectedService = params.service?.trim() || undefined;
  const selectedStatus = validStatuses.includes(params.status as OutageStatus) ? (params.status as OutageStatus) : undefined;
  const alerts = await fetchAlerts();
  const items = alerts
    .filter((item) => item.category === 'Outage')
    .sort((a, b) => (rank[b.status ?? 'Resolved'] ?? 0) - (rank[a.status ?? 'Resolved'] ?? 0));
  const filteredItems = items.filter((item) => matchesService(item, selectedService) && (!selectedStatus || item.status === selectedStatus));

  return (
    <>
      <PageHero title="Outages" subtitle="Service incident and disruption tracking with status visibility for operational response teams." />
      <section className="container page-section" style={{ paddingTop: 0 }}>
        {items.length === 0 ? (
          <EmptyState title="No active outage records" description="Outage alerts appear here with lifecycle status from investigating through resolved." />
        ) : (
          <>
            {/* Status Dashboard */}
            <OutageStatusDashboard outages={filteredItems} selectedService={selectedService} selectedStatus={selectedStatus} />

            {/* Timeline & Affected Services */}
            <OutageTimeline outages={filteredItems} allOutages={items} selectedService={selectedService} selectedStatus={selectedStatus} />

            {/* All Incidents Grid */}
            <div style={{ marginTop: '3rem' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 600 }}>All Incidents</h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                {filteredItems.map((item) => (
                  <AlertCard key={item.id} alert={item} />
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
