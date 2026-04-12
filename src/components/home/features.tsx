const features = [
  'Real-Time Vulnerability Alerts',
  'Microsoft Patch Monitoring',
  'Outage & Incident Tracking',
  'Centralized IT Intelligence Dashboard'
];

export function Features() {
  return (
    <section className="page-section" style={{ paddingTop: 0 }}>
      <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {features.map((feature) => (
          <article key={feature} className="card" style={{ padding: '1.1rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.35rem', fontSize: '1.05rem' }}>{feature}</h3>
            <p style={{ margin: 0, color: '#9fb0ce', fontSize: '0.93rem' }}>
              Built for IT operators who need rapid context and reliable technical signal.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
