'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section
      className="page-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '8rem',
      }}
    >
      {/* Animated background grid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.3,
          animation: 'float 20s ease-in-out infinite',
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(135deg, rgba(15, 30, 50, 0.8), rgba(25, 45, 75, 0.6))',
          border: '2px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '12px',
          padding: '4rem 2rem',
          display: 'grid',
          gap: '1.5rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 60px rgba(0, 240, 255, 0.15), inset 0 0 40px rgba(0, 240, 255, 0.05)',
        }}
      >
        {/* Accent badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: 'fit-content',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            color: '#00f0ff',
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#39ff14', boxShadow: '0 0 10px #39ff14' }} />
          Real-Time Intelligence
        </div>

        {/* Main headline */}
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #00f0ff 0%, #ff006e 50%, #b700ff 100%)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient-shift 6s ease infinite',
            letterSpacing: '-0.5px',
          }}
        >
          Real-Time IT Alerts & Update Intelligence
        </h1>

        {/* Subheading */}
        <p
          style={{
            margin: 0,
            maxWidth: 800,
            color: '#a0a8c0',
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Stay ahead with <span style={{ color: '#00f0ff', fontWeight: 600 }}>instant alerts</span> on vulnerabilities, Microsoft patches, outages,
          and critical tech updates. Get cybersecurity intelligence delivered to your dashboard in real-time.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Link
            href="/alerts"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.9rem 2rem',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #00f0ff, #00d0ff)',
              color: '#08080a',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              border: '2px solid #00f0ff',
              cursor: 'pointer',
              transition: 'all 0.3s ease-out',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 240, 255, 0.8)';
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.4)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <span>⚡</span> Get Alerts
          </Link>

          <Link
            href="/about"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.9rem 2rem',
              borderRadius: '6px',
              background: 'transparent',
              color: '#ff006e',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              border: '2px solid #ff006e',
              cursor: 'pointer',
              transition: 'all 0.3s ease-out',
              boxShadow: '0 0 20px rgba(255, 0, 110, 0.3) inset',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 0, 110, 0.6), inset 0 0 20px rgba(255, 0, 110, 0.3)';
              e.currentTarget.style.background = 'rgba(255, 0, 110, 0.1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 110, 0.3) inset';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>→</span> Learn More
          </Link>
        </div>

        {/* Stats row */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(0, 240, 255, 0.2)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { label: 'Real-Time Feeds', value: '6+' },
            { label: 'Alerts Tracked', value: '1000+' },
            { label: 'Data Sources', value: 'Live' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', color: '#00f0ff', fontWeight: 700, marginBottom: '0.25rem', textShadow: '0 0 10px #00f0ff' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#a0a8c0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
      `}</style>
    </section>
  );
}
