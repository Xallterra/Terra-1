import { AlertItem, OutageStatus } from '@/types/alert';
import { calculateOutageStats, getStatusColor, getStatusIcon } from '@/lib/outage-stats';

export function OutageStatusDashboard({ outages }: { outages: AlertItem[] }) {
  const stats = calculateOutageStats(outages);
  const statusOrder: OutageStatus[] = ['Investigating', 'Identified', 'Monitoring', 'Resolved'];

  return (
    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
      {/* Main Stats Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div
          className="card"
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            borderLeft: `4px solid #ef4444`,
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%)',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b6b' }}>{stats.total}</div>
          <div style={{ color: '#a2b2cd', fontSize: '0.9rem' }}>Total Outages</div>
        </div>

        <div
          className="card"
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            borderLeft: `4px solid #fbbf24`,
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, transparent 100%)',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>{stats.investigating}</div>
          <div style={{ color: '#a2b2cd', fontSize: '0.9rem' }}>🔍 Investigating</div>
        </div>

        <div
          className="card"
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            borderLeft: `4px solid #f97316`,
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, transparent 100%)',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>{stats.identified}</div>
          <div style={{ color: '#a2b2cd', fontSize: '0.9rem' }}>⚠️ Identified</div>
        </div>

        <div
          className="card"
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            borderLeft: `4px solid #10b981`,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{stats.resolved}</div>
          <div style={{ color: '#a2b2cd', fontSize: '0.9rem' }}>✅ Resolved (24h)</div>
        </div>
      </div>

      {/* Status Timeline */}
      {stats.total > 0 && (
        <div
          className="card"
          style={{
            padding: '1.5rem',
            display: 'grid',
            gap: '1rem',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Incident Status Breakdown</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {statusOrder.map((status) => {
              const count = stats[status.toLowerCase() as keyof typeof stats] as number;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const color = getStatusColor(status);
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                    <span>{getStatusIcon(status)} {status}</span>
                    <span style={{ color, fontWeight: 600 }}>
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: '#1e293b',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: color,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
