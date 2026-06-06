'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Bell, Home, ShieldAlert, UsersRound } from 'lucide-react';
import { SiteSearch } from './site-search';

const links: { href: Route; label: string }[] = [
  { href: '/', label: 'Community' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/vulnerabilities', label: 'Vulnerabilities' },
  { href: '/outages', label: 'Outages' },
  { href: '/microsoft-updates', label: 'Updates' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/admin', label: 'Admin' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Makriva home">
          <span className="site-header__brand-mark">M</span>
          <span>Makriva</span>
        </Link>

        <Suspense fallback={<div className="site-search site-search--loading" />}>
          <SiteSearch />
        </Suspense>

        <nav className="site-header__nav" aria-label="Primary navigation">
          {links.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href} className={`site-header__link ${isActive ? 'is-active' : ''}`}>
                {item.href === '/' && <Home size={16} aria-hidden="true" />}
                {item.href === '/alerts' && <Bell size={16} aria-hidden="true" />}
                {item.href === '/vulnerabilities' && <ShieldAlert size={16} aria-hidden="true" />}
                {item.href === '/admin' && <UsersRound size={16} aria-hidden="true" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
