import Link from 'next/link';
import type { AlertItem } from '@/types/alert';
import type { CommunityPost, CommunityProfile } from '@/types/community';
import { RoleBadge, SeverityBadge } from './status-badges';

export function CommunitySidebar({ alerts, unresolved, profiles }: { alerts: AlertItem[]; unresolved: CommunityPost[]; profiles: CommunityProfile[] }) {
  const tags = ['Intune', 'Microsoft 365', 'Defender', 'Outages', 'Patch Management', 'Entra ID', 'SCCM'];
  return (
    <aside className="mk-sidebar">
      <section className="mk-panel">
        <div className="mk-section-title">
          <h2>Live Critical Alerts</h2>
        </div>
        <div className="mk-stack">
          {alerts.slice(0, 4).map((alert) => (
            <Link href={`/alerts/${alert.slug}`} className="mk-alert-mini" key={alert.id}>
              <strong>{alert.title}</strong>
              <span>{alert.subcategory}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mk-panel">
        <div className="mk-section-title">
          <h2>Unresolved High Impact</h2>
        </div>
        <div className="mk-stack">
          {unresolved.slice(0, 4).map((post) => (
            <Link href={`/posts/${post.slug}`} className="mk-alert-mini" key={post.id}>
              <SeverityBadge severity={post.severity} />
              <strong>{post.title}</strong>
            </Link>
          ))}
        </div>
      </section>
      <section className="mk-panel">
        <div className="mk-section-title">
          <h2>Trending Tags</h2>
        </div>
        <div className="mk-tag-cloud">
          {tags.map((tag) => (
            <Link href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} key={tag}>
              {tag}
            </Link>
          ))}
        </div>
      </section>
      <section className="mk-panel">
        <div className="mk-section-title">
          <h2>Verified Professionals</h2>
        </div>
        <div className="mk-stack">
          {profiles.slice(0, 4).map((profile) => (
            <Link href={`/profile/${profile.username}`} className="mk-pro-mini" key={profile.id}>
              <strong>{profile.displayName}</strong>
              <span>{profile.title}</span>
              <RoleBadge role={profile.role} />
              <small>{profile.reputation.toLocaleString()} rep</small>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}
