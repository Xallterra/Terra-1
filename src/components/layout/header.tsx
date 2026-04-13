'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { SiteSearch } from './site-search';

const links: { href: Route; label: string }[] = [
  { href: '/', label: 'Dashboard' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/vulnerabilities', label: 'Vulnerabilities' },
  { href: '/outages', label: 'Outages' },
  { href: '/microsoft-updates', label: 'Updates' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        borderBottom: '2px solid rgba(0, 240, 255, 0.2)',
        background: 'rgba(8, 14, 24, 0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)',
      }}
    >
      <style>{`
        .nav-glow {
          position: relative;
          transition: all 0.3s ease-out;
        }
        .nav-glow::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #00f0ff, #ff006e, #b700ff, #00f0ff);
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }
        .nav-glow:hover::after {
          opacity: 1;
        }
        .nav-glow.active {
          color: #00f0ff;
          text-shadow: 0 0 10px #00f0ff;
        }
        .nav-glow.active::after {
          opacity: 1;
        }
      `}</style>

      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          padding: '1rem 2rem',
          maxWidth: '100%',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #00f0ff, #ff006e, #b700ff, #00f0ff)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '2px',
            textDecoration: 'none',
            animation: 'gradient-shift 3s ease infinite',
            textShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>⏢</span> MAKRIVA
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            flex: '1 1 42rem',
          }}
        >
          <nav
            style={{
              display: 'flex',
              gap: '1.4rem',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {links.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-glow ${isActive ? 'active' : ''}`}
                  style={{
                    color: isActive ? '#00f0ff' : '#a0a0c0',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: isActive ? '0.5px' : '0px',
                    textShadow: isActive ? '0 0 10px rgba(0, 240, 255, 0.5)' : 'none',
                    transition: 'all 0.3s ease-out',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Suspense
            fallback={
              <div
                style={{
                  minWidth: '20rem',
                  flex: '0 1 20rem',
                  height: '2.9rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(0, 240, 255, 0.18)',
                  background: 'rgba(11, 17, 30, 0.62)',
                }}
              />
            }
          >
            <SiteSearch />
          </Suspense>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingLeft: '1rem',
              borderLeft: '1px solid rgba(0, 240, 255, 0.2)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#39ff14',
                boxShadow: '0 0 10px #39ff14',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#39ff14', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Online
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </header>
  );
}
