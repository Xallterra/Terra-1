export function SubscribeCta() {
  return (
    <section className="page-section" style={{ paddingTop: 0 }}>
      <div className="container card" style={{ padding: '1.5rem', display: 'grid', gap: '0.8rem' }}>
        <h2 style={{ margin: 0 }}>Get critical alerts in your inbox</h2>
        <p style={{ margin: 0, color: '#9fb0ce' }}>
          Configure alert subscriptions by category, severity, and product area (Microsoft, vulnerabilities, outages).
        </p>
        <form style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <input className="input" style={{ maxWidth: 360 }} placeholder="Work email" type="email" />
          <button type="submit" className="btn">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
