import { PageHero } from '@/components/shared/page-hero';

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Makriva"
        subtitle="Makriva is a real-time IT intelligence platform built for IT professionals to stay informed about vulnerabilities, Microsoft patch updates, outages, and critical technical events."
      />
      <section className="container page-section" style={{ paddingTop: 0 }}>
        <article className="card" style={{ padding: '1.5rem', color: '#a8b8d3', lineHeight: 1.7 }}>
          Makriva is designed for modern IT operations, security engineering, and endpoint management teams that need
          trusted context quickly. Our mission is to simplify noisy technical signals into clear, action-ready alerts
          that help teams prioritize response and reduce downtime.
        </article>
      </section>
    </>
  );
}
