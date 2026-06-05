import { notFound } from 'next/navigation';
import { Award, BriefcaseBusiness, CheckCircle2, FileText } from 'lucide-react';
import { RoleBadge } from '@/components/community/status-badges';
import { getProfileByUsername } from '@/lib/community-data';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  return (
    <section className="container page-section">
      <article className="mk-panel mk-profile">
        <div>
          <p className="mk-kicker">Professional Profile</p>
          <h1>{profile.displayName}</h1>
          <p>{profile.title}{profile.company ? ` at ${profile.company}` : ''}</p>
          <RoleBadge role={profile.role} />
        </div>
        <div className="mk-profile-grid">
          <span><Award size={18} /> {profile.reputation.toLocaleString()} reputation</span>
          <span><CheckCircle2 size={18} /> {profile.acceptedAnswersCount} accepted answers</span>
          <span><FileText size={18} /> {profile.postsCount} posts</span>
          <span><BriefcaseBusiness size={18} /> {profile.skills.join(', ')}</span>
        </div>
      </article>
    </section>
  );
}
