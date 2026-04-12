export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1f2c46', marginTop: '3rem' }}>
      <div className="container" style={{ padding: '2rem 0', display: 'grid', gap: '0.8rem' }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Makriva</p>
        <p style={{ margin: 0, color: '#98a8c5' }}>
          Real-time IT intelligence for cybersecurity teams, system administrators, and modern endpoint operations.
        </p>
        <p style={{ margin: 0, color: '#98a8c5', fontSize: '0.9rem' }}>© {new Date().getFullYear()} Makriva. All rights reserved.</p>
      </div>
    </footer>
  );
}
