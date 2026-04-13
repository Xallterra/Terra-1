import { AlertsBrowser } from '@/components/alerts/alerts-browser';
import { PageHero } from '@/components/shared/page-hero';
import { fetchAlerts } from '@/lib/alerts-data';

export const revalidate = 300;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const alerts = await fetchAlerts();
  const sorted = [...alerts].sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at));

  return (
    <>
      <PageHero
        title="Search"
        subtitle={query ? `Scanning the intelligence feed for "${query}".` : 'Search across outages, Microsoft updates, vulnerabilities, tags, and source names.'}
      />
      <section className="container page-section" style={{ paddingTop: 0 }}>
        <AlertsBrowser items={sorted} initialSearch={query} requireSearchTerm />
      </section>
    </>
  );
}
