import Link from 'next/link';
import type { Route } from 'next';

const links: Array<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/microsoft-updates', label: 'Microsoft Updates' },
  { href: '/vulnerabilities', label: 'Vulnerabilities' },
  { href: '/outages', label: 'Outages' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export function Header() {
  return (
    <header style={{ borderBottom: '1px solid #1f2c46', backdropFilter: 'blur(12px)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
        <Link href="/" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
          Makriva
        </Link>
        <nav className="main-nav">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="main-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
