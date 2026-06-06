import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>Makriva helps admins share field reports, verified fixes, and live operational intelligence.</p>
        <nav aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/alerts">Alerts</Link>
          <Link href="/solutions">Solutions</Link>
        </nav>
      </div>
    </footer>
  );
}
