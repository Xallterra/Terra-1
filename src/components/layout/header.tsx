'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const canSeeAdmin = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  const navLinks = canSeeAdmin ? [...links, { href: '/admin' as Route, label: 'Admin' }] : links;

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
          {navLinks.map((item) => {
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
          {status !== 'loading' && !user && (
            <>
              <Link href="/login" className="site-header__link">
                Log in
              </Link>
              <Link href="/signup" className="site-header__link site-header__link--primary">
                Create account
              </Link>
            </>
          )}
          {user && (
            <div className="site-header__account">
              <Link href={`/profile/${user.username}`} className="site-header__link">
                {user.name ?? user.username}
              </Link>
              <Link href="/account" className="site-header__link">
                Account
              </Link>
              <Link href="/logout" className="site-header__link">
                Logout
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
