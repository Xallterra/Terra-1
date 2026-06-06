import { CheckCircle2, Flag, Triangle } from 'lucide-react';
import Link from 'next/link';
import type { CommunityComment, CommunityPost } from '@/types/community';
import { acceptSolutionAction, createCommentAction, reportAction, voteAction } from '@/lib/community-actions';
import { getCurrentUser } from '@/lib/auth';
import { RoleBadge } from './status-badges';

export async function CommentThread({ post, comments }: { post: CommunityPost; comments: CommunityComment[] }) {
  const user = await getCurrentUser();

  return (
    <section className="mk-panel mk-comments">
      <div className="mk-section-title">
        <div>
          <h2>Field Responses</h2>
          <p>Nested replies, workarounds, verification notes, and accepted solution flow.</p>
        </div>
      </div>
      <ReplyForm postId={post.id} slug={post.slug} canReply={Boolean(user)} />
      <div className="mk-stack">
        {comments.length === 0 ? <p className="text-muted">No responses yet. Add the first field observation.</p> : comments.map((comment) => <CommentItem comment={comment} post={post} canReply={Boolean(user)} key={comment.id} />)}
      </div>
    </section>
  );
}

function CommentItem({ comment, post, canReply }: { comment: CommunityComment; post: CommunityPost; canReply: boolean }) {
  return (
    <article className={`mk-comment ${comment.isAccepted ? 'is-accepted' : ''} ${comment.isModeratorNote ? 'is-mod-note' : ''}`}>
      <div className="mk-comment__bar">
        <strong>{comment.author.displayName}</strong>
        <RoleBadge role={comment.author.role} />
        {comment.isAccepted && (
          <span className="mk-positive">
            <CheckCircle2 size={14} />
            accepted solution
          </span>
        )}
        {comment.isModeratorNote && <span className="mk-badge mk-badge--mod">Moderator Note</span>}
        <time>{new Date(comment.createdAt).toLocaleString()}</time>
      </div>
      <p>{comment.body}</p>
      <div className="mk-comment__actions">
        <form action={voteAction}>
          <input type="hidden" name="targetType" value="COMMENT" />
          <input type="hidden" name="targetId" value={comment.id} />
          <button className="mk-icon-button">
            <Triangle size={14} />
            {comment.voteCount}
          </button>
        </form>
        <form action={acceptSolutionAction}>
          <input type="hidden" name="postId" value={post.id} />
          <input type="hidden" name="commentId" value={comment.id} />
          <button className="mk-link-button">Mark accepted</button>
        </form>
        <form action={reportAction}>
          <input type="hidden" name="targetType" value="COMMENT" />
          <input type="hidden" name="targetId" value={comment.id} />
          <input type="hidden" name="reason" value="Needs moderator review" />
          <button className="mk-link-button">
            <Flag size={13} />
            Report
          </button>
        </form>
      </div>
      <ReplyForm postId={post.id} slug={post.slug} parentId={comment.id} compact canReply={canReply} />
      {comment.replies.length > 0 && (
        <div className="mk-replies">
          {comment.replies.map((reply) => (
            <CommentItem comment={reply} post={post} canReply={canReply} key={reply.id} />
          ))}
        </div>
      )}
    </article>
  );
}

function ReplyForm({ postId, slug, parentId, compact = false, canReply }: { postId: string; slug: string; parentId?: string; compact?: boolean; canReply: boolean }) {
  if (!canReply) {
    return (
      <div className="auth-cta compact">
        <span>Log in to comment, vote, report, or mark accepted solutions.</span>
        <div>
          <Link href="/login" className="mk-link-button">
            Log in
          </Link>
          <Link href="/signup" className="mk-link-button">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={createCommentAction} className={compact ? 'mk-reply-form compact' : 'mk-reply-form'}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="slug" value={slug} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <textarea name="body" className="mk-input" placeholder={compact ? 'Reply with a verification note...' : 'Add a fix, workaround, KQL query, PowerShell snippet, or field observation...'} required minLength={5} />
      <button className="btn btn-primary" type="submit">
        Reply
      </button>
    </form>
  );
}
