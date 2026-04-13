'use client';

const features = [
  {
    id: '01',
    title: 'Threat Intake Console',
    description: 'Route vulnerabilities, zero-day chatter, and remediation signals into one prioritized intake lane.',
    detail: 'Severity scoring, analyst notes, and routing logic stay visible in a single module.',
    color: '#79e7ff',
  },
  {
    id: '02',
    title: 'Patch Operations Board',
    description: 'Track Microsoft releases, maintenance windows, and deployment readiness from a central patch board.',
    detail: 'Designed like an operations desk instead of isolated cards, so teams can move from watch to action.',
    color: '#4da3ff',
  },
  {
    id: '03',
    title: 'Incident Signal Matrix',
    description: 'Watch provider outages, platform health, and customer-facing incidents on the same surface.',
    detail: 'Fast scan patterns make it feel closer to a control room wall than a brochure section.',
    color: '#ff6b8f',
  },
  {
    id: '04',
    title: 'Central Command Summary',
    description: 'Keep the big picture in frame with live KPIs, active sectors, and rolling event traffic.',
    detail: 'Built for centralized monitoring where all teams can orient themselves immediately.',
    color: '#8ef7bf',
  },
];

export function Features() {
  return (
    <section className="page-section" style={{ paddingTop: '1rem' }}>
      <div className="container" style={{ display: 'grid', gap: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            alignItems: 'end',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'grid', gap: '0.4rem', maxWidth: '42rem' }}>
            <span
              style={{
                color: '#8fdfff',
                fontSize: '0.76rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Control Modules
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: '#edf6ff',
                letterSpacing: '-0.04em',
              }}
            >
              Reframed as a centralized operations floor, not a standard dashboard grid.
            </h2>
          </div>

          <p
            style={{
              margin: 0,
              maxWidth: '24rem',
              color: 'rgba(188, 204, 229, 0.78)',
              lineHeight: 1.7,
            }}
          >
            Each panel is shaped to feel like a command module with stronger hierarchy, scan-friendly labels, and live-room energy.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {features.map((feature) => (
            <article
              key={feature.id}
              className="control-module"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 18, 33, 0.96), rgba(11, 23, 40, 0.85))',
                border: `1px solid ${feature.color}44`,
                borderRadius: '22px',
                padding: '1.4rem',
                position: 'relative',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: 'minmax(70px, 90px) minmax(0, 1.2fr) minmax(0, 0.85fr)',
                gap: '1.2rem',
                alignItems: 'start',
                transition: 'all 0.3s ease-out',
                boxShadow: '0 18px 44px rgba(2, 8, 18, 0.3)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${feature.color}99`;
                el.style.boxShadow = `0 22px 50px ${feature.color}18`;
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${feature.color}44`;
                el.style.boxShadow = '0 18px 44px rgba(2, 8, 18, 0.3)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                  opacity: 0.85,
                }}
              />

              <div style={{ display: 'grid', gap: '0.35rem' }}>
                <span
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '16px',
                    border: `1px solid ${feature.color}55`,
                    background: `${feature.color}15`,
                    color: feature.color,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    boxShadow: `inset 0 0 24px ${feature.color}10`,
                  }}
                >
                  {feature.id}
                </span>
                <span
                  style={{
                    color: 'rgba(176, 197, 225, 0.68)',
                    fontSize: '0.74rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                  }}
                >
                  Module
                </span>
              </div>

              <div style={{ display: 'grid', gap: '0.65rem' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    color: '#edf6ff',
                    fontWeight: 700,
                    lineHeight: 1.25,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'rgba(190, 207, 231, 0.82)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                  }}
                >
                  {feature.description}
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '0.75rem',
                  alignContent: 'space-between',
                  minHeight: '100%',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: 'rgba(165, 187, 220, 0.72)',
                    fontSize: '0.88rem',
                    lineHeight: 1.7,
                  }}
                >
                  {feature.detail}
                </p>
                <div
                  style={{
                    display: 'inline-flex',
                    width: 'fit-content',
                    padding: '0.45rem 0.7rem',
                    borderRadius: '999px',
                    border: `1px solid ${feature.color}44`,
                    color: feature.color,
                    background: `${feature.color}10`,
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  Active module
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  right: '-2rem',
                  bottom: '-2rem',
                  width: '8rem',
                  height: '8rem',
                  borderRadius: '999px',
                  background: `radial-gradient(circle, ${feature.color}18, transparent 70%)`,
                }}
              />
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .control-module {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
