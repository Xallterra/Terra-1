import { PageHero } from '@/components/shared/page-hero';
import { AlertsBrowser } from '@/components/alerts/alerts-browser';
import { fetchAlerts } from '@/lib/alerts-data';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function AlertsPage() {
  const alerts = await fetchAlerts();
  const sorted = [...alerts].sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at));

  return (
    <>
      <PageHero title="Alerts" subtitle="Unified stream of vulnerabilities, outages, Microsoft updates, and strategic technology advisories." />
      <section className="container page-section" style={{ paddingTop: 0 }}>
        <AlertsBrowser items={sorted} />
      </section>
    </>
  );
}
