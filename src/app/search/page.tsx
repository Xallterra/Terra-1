import { AlertsBrowser } from '@/components/alerts/alerts-browser';
import { PostCard } from '@/components/community/post-card';
import { PageHero } from '@/components/shared/page-hero';
import { fetchAlerts } from '@/lib/alerts-data';
import { searchCommunity } from '@/lib/community-data';

export const revalidate = 60;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const [results, alerts] = await Promise.all([query ? searchCommunity(query) : { posts: [] }, fetchAlerts()]);
  const sortedAlerts = [...alerts].sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at));

  return (
    <section className="container page-section mk-stack">
      <PageHero
        title="Search Makriva"
        subtitle={query ? `Scanning community solutions and live intelligence for "${query}".` : 'Search across posts, comments, accepted solutions, outages, updates, vulnerabilities, and tags.'}
      />
      <form action="/search" className="mk-search-page">
        <input name="q" className="mk-input" defaultValue={query} placeholder="Search posts, comments, alerts, vulnerabilities, solutions..." />
        <button className="btn btn-primary">Search</button>
      </form>
      {results.posts.length > 0 && (
        <section className="mk-stack">
          <h2>Community results</h2>
          {results.posts.map((post) => <PostCard post={post} key={post.id} />)}
        </section>
      )}
      <section className="mk-stack">
        <h2>Alert intelligence</h2>
        <AlertsBrowser items={sortedAlerts} initialSearch={query} requireSearchTerm />
      </section>
    </section>
  );
}
