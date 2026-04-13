import { PageHero } from '@/components/shared/page-hero';
import { AlertCard } from '@/components/alerts/alert-card';
import { EmptyState } from '@/components/shared/empty-state';
import { fetchAlerts } from '@/lib/alerts-data';

const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 } as const;

export const revalidate = 300;

export default async function VulnerabilitiesPage() {
  const alerts = await fetchAlerts();
  const items = alerts
    .filter((item) => item.category === 'Vulnerability' || item.category === 'Security Advisory')
    .sort((a, b) => (rank[b.severity ?? 'Low'] ?? 0) - (rank[a.severity ?? 'Low'] ?? 0));

  return (
    <>
      <PageHero title="Vulnerabilities" subtitle="CVE and security advisory intelligence prioritized by severity and operational impact." />
      <section className="container page-section" style={{ paddingTop: 0 }}>
        {items.length === 0 ? (
          <EmptyState title="No vulnerability alerts found" description="Security alerts will populate this feed when new exposures are identified." />
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
