import type { FeedSort } from '@/types/community';
import { AskComposer } from '@/components/community/ask-composer';
import { CommunitySidebar } from '@/components/community/community-sidebar';
import { FeedFilters } from '@/components/community/feed-filters';
import { PostCard } from '@/components/community/post-card';
import { getCommunityFeed, getTopProfiles } from '@/lib/community-data';
import { fetchAlerts } from '@/lib/alerts-data';

type HomeSearchParams = {
  category?: string;
  sort?: FeedSort;
  q?: string;
};

export const revalidate = 30;

export default async function HomePage({ searchParams }: { searchParams: Promise<HomeSearchParams> }) {
  const params = await searchParams;
  const [posts, alerts, unresolved, profiles] = await Promise.all([
    getCommunityFeed({ category: params.category, sort: params.sort, query: params.q }),
    fetchAlerts(),
    getCommunityFeed({ sort: 'unresolved', take: 5 }),
    getTopProfiles(),
  ]);

  const criticalAlerts = alerts.filter((alert) => alert.severity === 'Critical' || alert.category === 'Outage').slice(0, 6);

  return (
    <section className="mk-command-center">
      <aside className="mk-left-nav">
        <div className="mk-panel">
          <h2>Operations Channels</h2>
          {['Endpoint', 'Intune', 'SCCM', 'Microsoft 365', 'Azure', 'AWS', 'Security', 'Vulnerabilities', 'Outages', 'Networking', 'Patch Management', 'Identity', 'Helpdesk'].map((item) => (
            <a href={`/?category=${encodeURIComponent(item)}`} className={params.category === item ? 'active' : ''} key={item}>
              {item}
            </a>
          ))}
        </div>
      </aside>

      <main className="mk-feed">
        <section className="mk-feed-hero">
          <div>
            <p className="mk-kicker">Makriva Community Command Center</p>
            <h1>Field-tested fixes before generic answers.</h1>
            <p>Problems, verified solutions, live alerts, vulnerabilities, and Microsoft update intelligence for IT operators.</p>
          </div>
        </section>
        <AskComposer />
        <FeedFilters category={params.category} sort={params.sort} />
        <div className="mk-stack">
          {posts.length === 0 ? (
            <section className="mk-panel">
              <h2>No matching field reports</h2>
              <p className="text-muted">Try a broader category or create the first post for this topic.</p>
            </section>
          ) : (
            posts.map((post) => <PostCard post={post} key={post.id} />)
          )}
        </div>
      </main>

      <CommunitySidebar alerts={criticalAlerts} unresolved={unresolved} profiles={profiles} />
    </section>
  );
}
