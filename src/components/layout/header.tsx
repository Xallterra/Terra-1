'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { SiteSearch } from './site-search';

const links: { href: Route; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/vulnerabilities', label: 'Vulnerabilities' },
  { href: '/outages', label: 'Outages' },
  { href: '/microsoft-updates', label: 'Updates' },
  { href: '/solutions', label: 'Solutions' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Makriva home">
          <span className="site-header__mark">M</span>
          <span>Makriva</span>
        </Link>

        <nav className="site-header__nav" aria-label="Primary navigation">
          {links.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={isActive ? 'active' : ''}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-header__tools">
          <Suspense fallback={<div className="site-search site-search--loading" aria-hidden="true" />}>
            <SiteSearch />
          </Suspense>
          <Link href="/admin" className="site-header__action">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
