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
        .site-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 1rem 2rem;
          max-width: 100%;
        }
        .site-header__logo {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #00f0ff, #ff006e, #b700ff, #00f0ff);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 2px;
          text-decoration: none;
          animation: gradient-shift 3s ease infinite;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .site-header__right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-end;
          flex: 1 1 42rem;
        }
        .site-header__nav {
          display: flex;
          gap: 1.4rem;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: center;
        }
        .site-header__status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-left: 1rem;
          border-left: 1px solid rgba(0, 240, 255, 0.2);
        }
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
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @media (max-width: 960px) {
          .site-header__inner {
            padding: 0.85rem 1rem;
          }
          .site-header__right {
            width: 100%;
            justify-content: stretch;
          }
          .site-header__nav {
            width: 100%;
            justify-content: center;
            gap: 1rem;
          }
        }
        @media (max-width: 640px) {
          .site-header__inner {
            gap: 0.85rem;
          }
          .site-header__logo {
            width: 100%;
            justify-content: center;
            font-size: 1.25rem;
          }
          .site-header__nav {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.15rem;
            scrollbar-width: thin;
          }
          .site-header__status {
            width: 100%;
            justify-content: center;
            padding-left: 0;
            border-left: none;
            border-top: 1px solid rgba(0, 240, 255, 0.2);
            padding-top: 0.75rem;
          }
        }
      `}</style>

      <div className="container site-header__inner">
        <Link href="/" className="site-header__logo">
          <span style={{ fontSize: '1.1rem' }}>MK</span>
          MAKRIVA
        </Link>

        <div className="site-header__right">
          <nav className="site-header__nav">
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
                    whiteSpace: 'nowrap',
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

          <div className="site-header__status">
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
    </header>
  );
}
