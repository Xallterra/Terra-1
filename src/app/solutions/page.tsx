import { PostCard } from '@/components/community/post-card';
import { getCommunityFeed } from '@/lib/community-data';

export const revalidate = 60;

export default async function SolutionsPage() {
  const posts = await getCommunityFeed({ sort: 'solved', take: 30 });
  return (
    <section className="container page-section mk-stack">
      <div className="mk-feed-hero">
        <p className="mk-kicker">Accepted Solutions</p>
        <h1>Verified fixes from real IT environments.</h1>
        <p>Threads with accepted answers, moderator notes, and reusable remediation context.</p>
      </div>
      {posts.map((post) => <PostCard post={post} key={post.id} />)}
    </section>
  );
}
