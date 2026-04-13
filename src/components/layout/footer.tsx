'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '2px solid rgba(0, 240, 255, 0.2)',
        marginTop: '4rem',
        background: 'rgba(8, 14, 24, 0.6)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div
        className="container"
        style={{
          padding: '3rem 2rem',
          display: 'grid',
          gap: '1.5rem',
          maxWidth: '100%',
        }}
      >
        {/* Footer content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {/* Brand section */}
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: '1.3rem',
                background: 'linear-gradient(135deg, #00f0ff, #ff006e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '1px',
              }}
            >
              ⏢ MAKRIVA
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#a0a8c0', fontSize: '0.9rem' }}>Real-time security intelligence platform.</p>
          </div>

          {/* Product section */}
          <div>
            <h4 style={{ margin: 0, color: '#00f0ff', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
              Product
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.4rem' }}>
              <li>
                <Link href="/alerts" style={{ color: '#a0a8c0', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }}>
                  Alerts
                </Link>
              </li>
              <li>
                <Link href="/vulnerabilities" style={{ color: '#a0a8c0', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }}>
                  Vulnerabilities
                </Link>
              </li>
              <li>
                <Link href="/outages" style={{ color: '#a0a8c0', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }}>
                  Outages
                </Link>
              </li>
            </ul>
          </div>

          {/* Company section */}
          <div>
            <h4 style={{ margin: 0, color: '#00f0ff', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
              Company
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.4rem' }}>
              <li>
                <Link href="/about" style={{ color: '#a0a8c0', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ color: '#a0a8c0', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s ease' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.3), transparent)' }} />

        {/* Copyright section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ margin: 0, color: '#707090', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Makriva. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <a href="#" style={{ color: '#707090', textDecoration: 'none', transition: 'color 0.3s ease' }}>
              Privacy
            </a>
            <a href="#" style={{ color: '#707090', textDecoration: 'none', transition: 'color 0.3s ease' }}>
              Terms
            </a>
            <a href="#" style={{ color: '#707090', textDecoration: 'none', transition: 'color 0.3s ease' }}>
              Cookies
            </a>
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '6px',
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            fontSize: '0.85rem',
            color: '#a0a8c0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#39ff14', boxShadow: '0 0 8px #39ff14' }} />
          All systems operational
        </div>
      </div>
    </footer>
  );
}
