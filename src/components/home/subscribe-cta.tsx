import { SubscribeForm } from '@/components/forms/subscribe-form';

export function SubscribeCta() {
  return (
    <section className="page-section" style={{ paddingTop: 0 }}>
      <div className="container card" style={{ padding: '1.5rem', display: 'grid', gap: '0.8rem' }}>
        <h2 style={{ margin: 0 }}>Get critical alerts in your inbox</h2>
        <p style={{ margin: 0, color: '#9fb0ce' }}>
          Configure alert subscriptions by category, severity, and product area (Microsoft, vulnerabilities, outages).
        </p>
        <SubscribeForm />
      </div>
    </section>
  );
}
