import Link from 'next/link';
import { Bookmark, CheckCircle2, MessageSquare, Triangle, UserRound } from 'lucide-react';
import type { CommunityPost } from '@/types/community';
import { bookmarkAction, voteAction } from '@/lib/community-actions';
import { RoleBadge, SeverityBadge, StatusBadge, TypeBadge } from './status-badges';

export function PostCard({ post }: { post: CommunityPost }) {
  return (
    <article className={`mk-post-card ${post.status === 'SOLVED' ? 'is-solved' : ''} ${post.severity === 'CRITICAL' ? 'is-critical' : ''}`}>
      <div className="mk-post-card__vote">
        <form action={voteAction}>
          <input type="hidden" name="targetType" value="POST" />
          <input type="hidden" name="targetId" value={post.id} />
          <button title="Upvote post" className="mk-icon-button">
            <Triangle size={16} />
          </button>
        </form>
        <strong>{post.voteCount}</strong>
      </div>
      <div className="mk-post-card__body">
        <div className="mk-card-badges">
          <TypeBadge type={post.type} />
          <SeverityBadge severity={post.severity} />
          <StatusBadge status={post.status} />
          {post.acceptedSolution && <span className="mk-badge mk-badge--verified">Verified Fix</span>}
          {post.affectedProduct && <span className="mk-badge mk-badge--product">{post.affectedProduct}</span>}
        </div>
        <Link href={`/posts/${post.slug}`} className="mk-post-title">
          {post.title}
        </Link>
        <p className="mk-post-preview">{post.body}</p>
        <div className="mk-tag-row">
          {post.tags.map((tag) => (
            <Link href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} key={tag}>
              #{tag}
            </Link>
          ))}
        </div>
        <div className="mk-post-meta">
          <span>
            <UserRound size={14} />
            <Link href={`/profile/${post.author.username}`}>{post.author.displayName}</Link>
          </span>
          <RoleBadge role={post.author.role} />
          <span>
            <MessageSquare size={14} />
            {post.commentCount} comments
          </span>
          {post.status === 'SOLVED' && (
            <span className="mk-positive">
              <CheckCircle2 size={14} />
              accepted solution
            </span>
          )}
          <time>{new Date(post.createdAt).toLocaleString()}</time>
        </div>
      </div>
      <form action={bookmarkAction}>
        <input type="hidden" name="postId" value={post.id} />
        <button title="Bookmark post" className="mk-icon-button">
          <Bookmark size={16} />
        </button>
      </form>
    </article>
  );
}
