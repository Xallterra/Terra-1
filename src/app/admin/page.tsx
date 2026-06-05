import { ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  return (
    <section className="container page-section mk-stack">
      <div className="mk-feed-hero">
        <p className="mk-kicker">Moderation Console</p>
        <h1>Trust and safety queue.</h1>
        <p>Foundation for reports, hidden content, locked threads, moderator notes, and reputation adjustments.</p>
      </div>
      <section className="mk-panel">
        <h2><ShieldAlert size={18} /> Moderation Foundations</h2>
        <div className="mk-grid-2">
          <div>
            <strong>Queues</strong>
            <p>Open reports, high-report posts, suspicious vote clusters, spam velocity, and locked thread review.</p>
          </div>
          <div>
            <strong>Actions</strong>
            <p>Hide content, lock thread, mark moderator note, uphold/reject report, adjust reputation, archive thread.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
