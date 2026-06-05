import type { CommunityRole, CommunitySeverity, PostStatus, PostType } from '@/types/community';

const severityClass: Record<CommunitySeverity, string> = {
  CRITICAL: 'mk-badge mk-badge--critical',
  HIGH: 'mk-badge mk-badge--high',
  MEDIUM: 'mk-badge mk-badge--medium',
  LOW: 'mk-badge mk-badge--low',
  INFORMATIONAL: 'mk-badge mk-badge--info',
};

const statusClass: Record<PostStatus, string> = {
  OPEN: 'mk-badge mk-badge--open',
  INVESTIGATING: 'mk-badge mk-badge--investigating',
  SOLVED: 'mk-badge mk-badge--solved',
  ARCHIVED: 'mk-badge mk-badge--muted',
};

export function SeverityBadge({ severity }: { severity: CommunitySeverity }) {
  return <span className={severityClass[severity]}>{severity.toLowerCase()}</span>;
}

export function StatusBadge({ status }: { status: PostStatus }) {
  return <span className={statusClass[status]}>{status === 'SOLVED' ? 'Solved' : status.toLowerCase()}</span>;
}

export function TypeBadge({ type }: { type: PostType }) {
  return <span className="mk-badge mk-badge--type">{type.toLowerCase()}</span>;
}

export function RoleBadge({ role }: { role: CommunityRole }) {
  if (role === 'ADMIN') return <span className="mk-badge mk-badge--admin">Admin</span>;
  if (role === 'MODERATOR') return <span className="mk-badge mk-badge--mod">Moderator</span>;
  if (role === 'VERIFIED_PROFESSIONAL') return <span className="mk-badge mk-badge--verified">Verified Pro</span>;
  return <span className="mk-badge mk-badge--muted">Member</span>;
}
