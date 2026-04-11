type PageHeroProps = {
  title: string;
  subtitle: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="page-section" style={{ paddingBottom: '1.5rem' }}>
      <div className="container card" style={{ padding: '2rem' }}>
        <h1 style={{ marginTop: 0, marginBottom: '0.55rem', fontSize: '2rem' }}>{title}</h1>
        <p style={{ margin: 0, color: '#9aaccb', maxWidth: 780 }}>{subtitle}</p>
      </div>
    </section>
  );
}
