import Link from 'next/link';
import type { Route } from 'next';

const footerGroups: { title: string; links: { href: Route; label: string }[] }[] = [
  {
    title: 'Explore',
    links: [
      { href: '/alerts', label: 'Alerts' },
      { href: '/vulnerabilities', label: 'Vulnerabilities' },
      { href: '/outages', label: 'Outages' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/solutions', label: 'Solutions' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <strong>Makriva</strong>
          <p>Practical IT alerts, fixes, and outage intelligence in one clean community feed.</p>
        </div>

        {footerGroups.map((group) => (
          <div className="site-footer__group" key={group.title}>
            <h4>{group.title}</h4>
            <ul>
              {group.links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="site-footer__status">
          <span />
          All systems operational
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} Makriva. All rights reserved.</p>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
