import { PostCard } from '@/components/community/post-card';
import { getCommunityFeed } from '@/lib/community-data';

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getCommunityFeed({ tag: slug, take: 30 });
  return (
    <section className="container page-section mk-stack">
      <div className="mk-feed-hero">
        <p className="mk-kicker">Tag Feed</p>
        <h1>#{slug.replace(/-/g, ' ')}</h1>
        <p>Community problems, field fixes, and alert context for this topic.</p>
      </div>
      {posts.map((post) => <PostCard post={post} key={post.id} />)}
    </section>
  );
}
