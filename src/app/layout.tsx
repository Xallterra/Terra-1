import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LayoutClient } from './layout-client';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? 'https://www.makriva.com'),
  title: 'Makriva | Real-Time IT Alerts & Update Intelligence',
  description:
    'Real-time IT intelligence platform for vulnerabilities, Microsoft updates, outages, and critical technical alerts.',
  icons: {
    icon: '/brand/makriva-mark.svg',
    apple: '/brand/makriva-mark.svg',
  },
  openGraph: {
    title: 'Makriva | Shared Intelligence for IT Admins',
    description:
      'Incidents, fixes, outage notes, vulnerabilities, and playbooks in one searchable admin workspace.',
    images: [{ url: '/brand/banner-1200x630.svg', width: 1200, height: 630, alt: 'Makriva shared intelligence platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Makriva | Shared Intelligence for IT Admins',
    description: 'Stop solving admin problems in silos.',
    images: ['/brand/banner-1200x630.svg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </LayoutClient>
      </body>
    </html>
  );
}
