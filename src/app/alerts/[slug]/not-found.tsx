import Link from 'next/link';

export default function AlertNotFound() {
  return (
    <section className="page-section">
      <div className="container card" style={{ padding: '1.5rem', display: 'grid', gap: '0.7rem' }}>
        <h1 style={{ margin: 0 }}>Alert not found</h1>
        <p style={{ margin: 0, color: '#9fb0ce' }}>The alert may have been removed, archived, or the URL may be incorrect.</p>
        <div>
          <Link href="/alerts" className="btn">
            Return to Alerts
          </Link>
        </div>
      </div>
    </section>
  );
}
