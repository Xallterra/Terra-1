'use client';

import Link from 'next/link';

const systemStats = [
  { label: 'Coverage', value: '06', detail: 'intel channels' },
  { label: 'Queue', value: '128', detail: 'events triaged/hr' },
  { label: 'Uptime', value: '99.98%', detail: 'monitoring fabric' },
];

const commandBoards = [
  {
    title: 'Threat Watch',
    status: 'Priority elevated',
    value: '14',
    detail: 'critical signals under watch',
    tone: '#6ee7ff',
  },
  {
    title: 'Patch Control',
    status: 'Deployment staged',
    value: '32',
    detail: 'Microsoft updates mapped',
    tone: '#4da3ff',
  },
  {
    title: 'Service Grid',
    status: 'Minor turbulence',
    value: '03',
    detail: 'providers with active incidents',
    tone: '#ff6b8f',
  },
];

const liveFeed = [
  { time: '00:01', label: 'Downdetector ingest synchronized', level: 'stable' },
  { time: '00:06', label: 'CVE prioritization refreshed', level: 'priority' },
  { time: '00:11', label: 'Patch release correlation completed', level: 'stable' },
  { time: '00:14', label: 'Cloud status anomaly detected', level: 'watch' },
];

const sectorLoad = [
  { name: 'North Grid', value: '92%', accent: '#6ee7ff' },
  { name: 'Core Relay', value: '87%', accent: '#7bf1a8' },
  { name: 'Incident Desk', value: '74%', accent: '#ffb347' },
];

export function Hero() {
  return (
    <section className="page-section home-hero">
      <div className="home-hero__fx home-hero__fx--grid" />
      <div className="home-hero__fx home-hero__fx--glow" />

      <div className="container home-hero__frame">
        <div className="home-hero__masthead">
          <div className="home-hero__eyebrow">
            <span className="home-hero__pulse" />
            Central command active
          </div>
          <div className="home-hero__mast-meta">
            <span>Makriva Operations Hub</span>
            <span>Unified security + outage telemetry</span>
          </div>
        </div>

        <div className="home-hero__layout">
          <div className="home-hero__main">
            <div className="home-hero__copy">
              <div className="home-hero__badge">Control Room Interface</div>
              <h1 className="home-hero__title">Centralized control center for live IT alerts, patching, and outage command.</h1>
              <p className="home-hero__description">
                Makriva now reads like an operations floor instead of a marketing hero. Vulnerability watchlists, Microsoft patch
                intelligence, and provider incidents are brought into one command surface so teams can triage and act from a single view.
              </p>

              <div className="home-hero__actions">
                <Link href="/alerts" className="home-hero__action home-hero__action--primary">
                  Open Alert Console
                </Link>
                <Link href="/outages" className="home-hero__action home-hero__action--secondary">
                  View Service Grid
                </Link>
              </div>
            </div>

            <div className="home-hero__stats">
              {systemStats.map((stat) => (
                <div key={stat.label} className="home-hero__stat-card">
                  <span className="home-hero__stat-label">{stat.label}</span>
                  <strong className="home-hero__stat-value">{stat.value}</strong>
                  <span className="home-hero__stat-detail">{stat.detail}</span>
                </div>
              ))}
            </div>

            <div className="home-hero__boards">
              {commandBoards.map((board) => (
                <article key={board.title} className="home-hero__board" style={{ ['--board-tone' as string]: board.tone }}>
                  <div className="home-hero__board-top">
                    <span className="home-hero__board-title">{board.title}</span>
                    <span className="home-hero__board-status">{board.status}</span>
                  </div>
                  <div className="home-hero__board-value">{board.value}</div>
                  <p className="home-hero__board-detail">{board.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="home-hero__side-panel">
            <div className="home-hero__radar">
              <div className="home-hero__radar-ring home-hero__radar-ring--outer" />
              <div className="home-hero__radar-ring home-hero__radar-ring--mid" />
              <div className="home-hero__radar-ring home-hero__radar-ring--inner" />
              <div className="home-hero__radar-sweep" />
              <div className="home-hero__radar-core" />
              <span className="home-hero__radar-dot home-hero__radar-dot--a" />
              <span className="home-hero__radar-dot home-hero__radar-dot--b" />
              <span className="home-hero__radar-dot home-hero__radar-dot--c" />
            </div>

            <div className="home-hero__side-card">
              <div className="home-hero__side-heading">
                <span>Live operator feed</span>
                <span>14s</span>
              </div>

              <div className="home-hero__feed">
                {liveFeed.map((item) => (
                  <div key={`${item.time}-${item.label}`} className="home-hero__feed-item">
                    <span className={`home-hero__feed-level home-hero__feed-level--${item.level}`} />
                    <div className="home-hero__feed-copy">
                      <strong>{item.label}</strong>
                      <span>{item.time} ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-hero__side-card">
              <div className="home-hero__side-heading">
                <span>Sector load</span>
                <span>balanced</span>
              </div>

              <div className="home-hero__sector-list">
                {sectorLoad.map((sector) => (
                  <div key={sector.name} className="home-hero__sector-row">
                    <div className="home-hero__sector-meta">
                      <span>{sector.name}</span>
                      <strong>{sector.value}</strong>
                    </div>
                    <div className="home-hero__sector-bar">
                      <span style={{ width: sector.value, background: sector.accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .home-hero {
          position: relative;
          overflow: hidden;
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .home-hero__fx {
          pointer-events: none;
          position: absolute;
          inset: 0;
        }

        .home-hero__fx--grid {
          background-image:
            linear-gradient(rgba(110, 231, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110, 231, 255, 0.08) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent);
          opacity: 0.35;
        }

        .home-hero__fx--glow {
          background:
            radial-gradient(circle at 15% 15%, rgba(77, 163, 255, 0.28), transparent 25%),
            radial-gradient(circle at 85% 20%, rgba(255, 107, 143, 0.18), transparent 20%),
            radial-gradient(circle at 50% 60%, rgba(110, 231, 255, 0.12), transparent 35%);
        }

        .home-hero__frame {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 1.5rem;
          padding: 1.25rem;
          border: 1px solid rgba(110, 231, 255, 0.24);
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(8, 14, 28, 0.92), rgba(7, 12, 24, 0.82)),
            linear-gradient(135deg, rgba(110, 231, 255, 0.06), transparent 50%);
          box-shadow:
            0 24px 80px rgba(1, 8, 18, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 0 32px rgba(110, 231, 255, 0.05);
        }

        .home-hero__masthead {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
          padding: 0.8rem 1rem;
          border: 1px solid rgba(110, 231, 255, 0.16);
          border-radius: 18px;
          background: rgba(12, 20, 36, 0.72);
        }

        .home-hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #d6efff;
        }

        .home-hero__pulse {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 999px;
          background: #7bf1a8;
          box-shadow: 0 0 16px rgba(123, 241, 168, 0.9);
          animation: command-pulse 1.8s ease-in-out infinite;
        }

        .home-hero__mast-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-end;
          color: rgba(187, 207, 235, 0.82);
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .home-hero__layout {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.95fr);
          gap: 1.25rem;
        }

        .home-hero__main,
        .home-hero__side-panel {
          display: grid;
          gap: 1rem;
        }

        .home-hero__copy,
        .home-hero__side-card {
          border: 1px solid rgba(110, 231, 255, 0.14);
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(12, 20, 36, 0.9), rgba(7, 13, 26, 0.8)),
            linear-gradient(135deg, rgba(110, 231, 255, 0.05), transparent 55%);
        }

        .home-hero__copy {
          padding: 1.5rem;
          min-height: 100%;
          display: grid;
          gap: 1.2rem;
        }

        .home-hero__badge {
          width: fit-content;
          padding: 0.45rem 0.85rem;
          border-radius: 999px;
          border: 1px solid rgba(110, 231, 255, 0.24);
          background: rgba(110, 231, 255, 0.08);
          color: #9ceeff;
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .home-hero__title {
          margin: 0;
          max-width: 12ch;
          font-size: clamp(2.6rem, 6vw, 4.8rem);
          line-height: 0.98;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #c5f6ff 0%, #6ee7ff 35%, #7aa8ff 70%, #ffc4d6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .home-hero__description {
          max-width: 56rem;
          margin: 0;
          color: rgba(202, 219, 245, 0.82);
          font-size: 1.02rem;
          line-height: 1.75;
        }

        .home-hero__actions {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .home-hero__action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          padding: 0.85rem 1.2rem;
          border-radius: 14px;
          border: 1px solid transparent;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.83rem;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .home-hero__action:hover {
          transform: translateY(-2px);
        }

        .home-hero__action--primary {
          color: #04111e;
          background: linear-gradient(135deg, #7df0ff, #59b8ff);
          box-shadow: 0 12px 30px rgba(89, 184, 255, 0.28);
        }

        .home-hero__action--secondary {
          color: #d9e8ff;
          border-color: rgba(255, 196, 214, 0.35);
          background: rgba(255, 255, 255, 0.02);
        }

        .home-hero__stats,
        .home-hero__boards {
          display: grid;
          gap: 1rem;
        }

        .home-hero__stats {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .home-hero__stat-card,
        .home-hero__board {
          position: relative;
          overflow: hidden;
          padding: 1rem 1.1rem;
          border: 1px solid rgba(110, 231, 255, 0.14);
          border-radius: 18px;
          background: rgba(10, 18, 33, 0.78);
        }

        .home-hero__stat-card::before,
        .home-hero__board::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(110, 231, 255, 0.75), transparent);
        }

        .home-hero__stat-label,
        .home-hero__board-title,
        .home-hero__board-status,
        .home-hero__stat-detail {
          display: block;
        }

        .home-hero__stat-label,
        .home-hero__board-title {
          color: rgba(180, 201, 230, 0.72);
          font-size: 0.74rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .home-hero__stat-value,
        .home-hero__board-value {
          display: block;
          margin-top: 0.6rem;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          line-height: 1;
          color: #f5fbff;
        }

        .home-hero__stat-detail,
        .home-hero__board-detail {
          margin-top: 0.5rem;
          color: rgba(180, 201, 230, 0.68);
          font-size: 0.88rem;
        }

        .home-hero__boards {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .home-hero__board {
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
        }

        .home-hero__board::before {
          background: linear-gradient(90deg, var(--board-tone), transparent);
        }

        .home-hero__board-top {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          align-items: start;
        }

        .home-hero__board-status {
          color: var(--board-tone);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .home-hero__side-panel {
          grid-template-rows: auto auto auto;
        }

        .home-hero__radar,
        .home-hero__side-card {
          position: relative;
          overflow: hidden;
          padding: 1.2rem;
          border: 1px solid rgba(110, 231, 255, 0.14);
          border-radius: 22px;
          background: rgba(10, 18, 33, 0.82);
        }

        .home-hero__radar {
          min-height: 250px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at center, rgba(110, 231, 255, 0.14), transparent 55%),
            rgba(10, 18, 33, 0.82);
        }

        .home-hero__radar-ring,
        .home-hero__radar-core,
        .home-hero__radar-sweep {
          position: absolute;
          border-radius: 999px;
        }

        .home-hero__radar-ring {
          border: 1px solid rgba(110, 231, 255, 0.18);
        }

        .home-hero__radar-ring--outer {
          width: 210px;
          height: 210px;
        }

        .home-hero__radar-ring--mid {
          width: 148px;
          height: 148px;
        }

        .home-hero__radar-ring--inner {
          width: 82px;
          height: 82px;
        }

        .home-hero__radar-sweep {
          width: 210px;
          height: 210px;
          background: conic-gradient(from 180deg, transparent 0deg, transparent 290deg, rgba(110, 231, 255, 0.28) 360deg);
          animation: radar-spin 6s linear infinite;
        }

        .home-hero__radar-core {
          width: 14px;
          height: 14px;
          background: #8fffe5;
          box-shadow: 0 0 18px rgba(143, 255, 229, 0.9);
        }

        .home-hero__radar-dot {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #9ceeff;
          box-shadow: 0 0 16px rgba(156, 238, 255, 0.85);
        }

        .home-hero__radar-dot--a {
          top: 30%;
          right: 25%;
        }

        .home-hero__radar-dot--b {
          bottom: 28%;
          left: 24%;
        }

        .home-hero__radar-dot--c {
          top: 52%;
          left: 62%;
        }

        .home-hero__side-heading,
        .home-hero__sector-meta {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .home-hero__side-heading {
          margin-bottom: 1rem;
          color: rgba(180, 201, 230, 0.72);
          font-size: 0.76rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .home-hero__feed,
        .home-hero__sector-list {
          display: grid;
          gap: 0.85rem;
        }

        .home-hero__feed-item {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.75rem;
          align-items: start;
          padding: 0.8rem 0.85rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.025);
        }

        .home-hero__feed-level {
          width: 0.6rem;
          height: 0.6rem;
          margin-top: 0.3rem;
          border-radius: 999px;
        }

        .home-hero__feed-level--stable {
          background: #7bf1a8;
          box-shadow: 0 0 14px rgba(123, 241, 168, 0.7);
        }

        .home-hero__feed-level--priority {
          background: #ffb347;
          box-shadow: 0 0 14px rgba(255, 179, 71, 0.7);
        }

        .home-hero__feed-level--watch {
          background: #ff7698;
          box-shadow: 0 0 14px rgba(255, 118, 152, 0.7);
        }

        .home-hero__feed-copy {
          display: grid;
          gap: 0.2rem;
        }

        .home-hero__feed-copy strong {
          color: #eaf4ff;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .home-hero__feed-copy span,
        .home-hero__sector-meta span {
          color: rgba(180, 201, 230, 0.68);
          font-size: 0.82rem;
        }

        .home-hero__sector-row {
          display: grid;
          gap: 0.45rem;
        }

        .home-hero__sector-meta strong {
          color: #f2f8ff;
          font-size: 0.84rem;
        }

        .home-hero__sector-bar {
          height: 0.5rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .home-hero__sector-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
        }

        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes command-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.88); }
        }

        @media (max-width: 1100px) {
          .home-hero__layout {
            grid-template-columns: 1fr;
          }

          .home-hero__boards {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .home-hero__frame {
            padding: 0.9rem;
            border-radius: 22px;
          }

          .home-hero__masthead {
            display: grid;
          }

          .home-hero__mast-meta {
            justify-content: start;
          }

          .home-hero__copy,
          .home-hero__radar,
          .home-hero__side-card {
            padding: 1rem;
          }

          .home-hero__title {
            max-width: none;
            font-size: clamp(2.2rem, 12vw, 3.4rem);
          }

          .home-hero__actions {
            flex-direction: column;
          }

          .home-hero__action,
          .home-hero__stats {
            width: 100%;
          }

          .home-hero__stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
