'use client';

const features = [
  {
    icon: '⚡',
    title: 'Real-Time Vulnerability Alerts',
    description: 'Instant notifications on critical vulnerabilities with severity levels and remediation guidance.',
    color: '#ff6b35',
  },
  {
    icon: '🔧',
    title: 'Microsoft Patch Monitoring',
    description: 'Track Microsoft security updates and patches in real-time across your environment.',
    color: '#0099ff',
  },
  {
    icon: '🚨',
    title: 'Outage & Incident Tracking',
    description: 'Monitor service outages, incidents, and status updates from major cloud providers.',
    color: '#ff0055',
  },
  {
    icon: '📊',
    title: 'Centralized IT Dashboard',
    description: 'Unified command center for all security and operational alerts in one view.',
    color: '#39ff14',
  },
];

export function Features() {
  return (
    <section className="page-section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {features.map((feature, i) => (
            <article
              key={i}
              style={{
                background: `linear-gradient(135deg, rgba(15, 22, 39, 0.9), rgba(25, 35, 55, 0.8))`,
                border: `2px solid ${feature.color}`,
                borderRadius: '8px',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease-out',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = feature.color;
                el.style.boxShadow = `0 0 40px ${feature.color}40`;
                el.style.background = `linear-gradient(135deg, rgba(15, 22, 39, 1), rgba(25, 45, 75, 0.9))`;
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = feature.color;
                el.style.boxShadow = 'none';
                el.style.background = `linear-gradient(135deg, rgba(15, 22, 39, 0.9), rgba(25, 35, 55, 0.8))`;
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                  opacity: 0.6,
                }}
              />

              {/* Icon */}
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '1rem',
                  textShadow: `0 0 20px ${feature.color}60`,
                }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  margin: '0 0 0.75rem 0',
                  fontSize: '1.15rem',
                  color: '#e0e8ff',
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  margin: 0,
                  color: '#a0a8c0',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </p>

              {/* Corner accent */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '50px',
                  height: '50px',
                  background: `${feature.color}10`,
                  borderRadius: '50% 0 0 0',
                  opacity: 0.3,
                }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
