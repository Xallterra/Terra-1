import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LayoutClient } from './layout-client';

export const metadata: Metadata = {
  title: 'Makriva | Real-Time IT Alerts & Update Intelligence',
  description:
    'Real-time IT intelligence platform for vulnerabilities, Microsoft updates, outages, and critical technical alerts.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          <LayoutClient>{children}</LayoutClient>
        </main>
        <Footer />
      </body>
    </html>
  );
}
