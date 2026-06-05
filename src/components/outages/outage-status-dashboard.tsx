import Link from 'next/link';
import type { Route } from 'next';
import { AlertItem, OutageStatus } from '@/types/alert';
import { calculateOutageStats, getStatusColor, getStatusIcon } from '@/lib/outage-stats';

type OutageStatusDashboardProps = {
  outages: AlertItem[];
  selectedService?: string;
  selectedStatus?: OutageStatus;
};

function getOutageHref({ service, status }: { service?: string; status?: OutageStatus }) {
  const params = new URLSearchParams();
  if (service) params.set('service', service);
  if (status) params.set('status', status);
  const query = params.toString();
  return (query ? `/outages?${query}` : '/outages') as Route;
}

export function OutageStatusDashboard({ outages, selectedService, selectedStatus }: OutageStatusDashboardProps) {
  const stats = calculateOutageStats(outages);
  const statusOrder: OutageStatus[] = ['Investigating', 'Identified', 'Monitoring', 'Resolved'];
  const statCards: { label: string; value: number; color: string; status?: OutageStatus; icon?: string }[] = [
    { label: 'Total Outages', value: stats.total, color: '#ef4444' },
    { label: 'Investigating', value: stats.investigating, color: '#fbbf24', status: 'Investigating', icon: '🔍' },
    { label: 'Identified', value: stats.identified, color: '#f97316', status: 'Identified', icon: '⚠️' },
    { label: 'Resolved (24h)', value: stats.resolved, color: '#10b981', status: 'Resolved', icon: '✅' },
  ];

  return (
    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
      {/* Main Stats Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {statCards.map((card) => {
          const isActive = card.status === selectedStatus || (!card.status && !selectedStatus);
          return (
            <Link
              key={card.label}
              href={getOutageHref({ service: selectedService, status: card.status })}
              className={`card outage-stat-card ${isActive ? 'is-active' : ''}`}
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                borderLeft: `4px solid ${card.color}`,
                background: `linear-gradient(135deg, ${card.color}1A 0%, transparent 100%)`,
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: card.color }}>{card.value}</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{card.icon ? `${card.icon} ` : ''}{card.label}</div>
            </Link>
          );
        })}
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
                <Link href={getOutageHref({ service: selectedService, status })} key={status} className="outage-status-breakdown-link">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                    <span>{getStatusIcon(status)} {status}</span>
                    <span style={{ color, fontWeight: 600 }}>
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: '#e2e8f0',
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
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
