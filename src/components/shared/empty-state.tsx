type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="card" style={{ padding: '2.2rem', textAlign: 'center' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ marginBottom: 0, color: '#9aaccb' }}>{description}</p>
    </div>
  );
}
