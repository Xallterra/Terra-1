import Link from 'next/link';

export function Hero() {
  return (
    <section className="page-section">
      <div className="container card" style={{ padding: '3rem 2rem', display: 'grid', gap: '1rem' }}>
        <p style={{ margin: 0, color: '#89b9ff', fontWeight: 600 }}>Makriva</p>
        <h1 style={{ margin: 0, fontSize: '2.4rem', lineHeight: 1.15 }}>Real-Time IT Alerts & Update Intelligence</h1>
        <p style={{ margin: 0, maxWidth: 760, color: '#a8b9d6', fontSize: '1.06rem' }}>
          Stay ahead with instant alerts on vulnerabilities, Microsoft patches, outages, and critical tech updates.
        </p>
        <div>
          <Link href="/alerts" className="btn">
            Get Alerts
          </Link>
        </div>
      </div>
    </section>
  );
}
