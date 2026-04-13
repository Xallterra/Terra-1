type PageHeroProps = {
  title: string;
  subtitle: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="page-section" style={{ paddingBottom: '1.5rem' }}>
      <div className="container card page-hero-card" style={{ padding: '2rem' }}>
        <style>{`
          @media (max-width: 768px) {
            .page-hero-card {
              padding: 1.25rem !important;
            }
            .page-hero-card h1 {
              font-size: 1.6rem !important;
            }
          }
        `}</style>
        <h1 style={{ marginTop: 0, marginBottom: '0.55rem', fontSize: '2rem', lineHeight: 1.1 }}>{title}</h1>
        <p style={{ margin: 0, color: '#9aaccb', maxWidth: 780, lineHeight: 1.7 }}>{subtitle}</p>
      </div>
    </section>
  );
}
