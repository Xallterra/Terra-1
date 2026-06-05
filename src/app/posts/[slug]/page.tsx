import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, Box, Building2, Cpu, ShieldCheck } from 'lucide-react';
import { CommentThread } from '@/components/community/comment-thread';
import { PostCard } from '@/components/community/post-card';
import { SeverityBadge, StatusBadge, TypeBadge } from '@/components/community/status-badges';
import { fetchAlerts } from '@/lib/alerts-data';
import { getCommentsForPost, getPostBySlug } from '@/lib/community-data';

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [comments, alerts] = await Promise.all([getCommentsForPost(post.id), fetchAlerts()]);
  const relatedAlerts = alerts
    .filter((alert) => `${alert.title} ${alert.summary} ${alert.tags.join(' ')}`.toLowerCase().includes((post.affectedProduct ?? post.category).toLowerCase()))
    .slice(0, 3);

  return (
    <section className="mk-detail-layout">
      <main className="mk-stack">
        <article className="mk-panel mk-post-detail">
          <div className="mk-card-badges">
            <TypeBadge type={post.type} />
            <SeverityBadge severity={post.severity} />
            <StatusBadge status={post.status} />
            {post.acceptedSolution && <span className="mk-badge mk-badge--verified">Verified Fix</span>}
          </div>
          <h1>{post.title}</h1>
          <div className="mk-post-meta">
            <Link href={`/profile/${post.author.username}`}>{post.author.displayName}</Link>
            <span>{post.author.title}</span>
            <time>{new Date(post.createdAt).toLocaleString()}</time>
          </div>
          <p>{post.body}</p>
          <div className="mk-tag-row">
            {post.tags.map((tag) => (
              <Link href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} key={tag}>
                #{tag}
              </Link>
            ))}
          </div>
        </article>

        {post.acceptedSolution && (
          <section className="mk-panel mk-accepted">
            <h2>
              <ShieldCheck size={18} />
              Accepted Solution
            </h2>
            <p>{post.acceptedSolution.body}</p>
            <span>By {post.acceptedSolution.author.displayName}</span>
          </section>
        )}

        <CommentThread post={post} comments={comments} />
      </main>

      <aside className="mk-sidebar">
        <section className="mk-panel">
          <h2>Environment</h2>
          <div className="mk-env-list">
            {post.affectedVendor && (
              <span>
                <Building2 size={14} />
                Vendor: {post.affectedVendor}
              </span>
            )}
            {post.affectedProduct && (
              <span>
                <Cpu size={14} />
                Product: {post.affectedProduct}
              </span>
            )}
            {Object.entries(post.environment).map(([key, value]) => (
              <span key={key}>
                <Box size={14} />
                {key}: {value}
              </span>
            ))}
          </div>
        </section>
        <section className="mk-panel">
          <h2>
            <AlertTriangle size={16} />
            Related Live Alerts
          </h2>
          <div className="mk-stack">
            {relatedAlerts.length === 0 ? <p className="text-muted">No directly related live alerts.</p> : relatedAlerts.map((alert) => (
              <Link href={`/alerts/${alert.slug}`} className="mk-alert-mini" key={alert.id}>
                <strong>{alert.title}</strong>
                <span>{alert.source_name}</span>
              </Link>
            ))}
          </div>
        </section>
        <PostCard post={post} />
      </aside>
    </section>
  );
}
