import { AlertItem } from '@/types/alert';
import { getStatusColor, getStatusIcon, getAffectedServicesFromOutages } from '@/lib/outage-stats';

export function OutageTimeline({ outages }: { outages: AlertItem[] }) {
  const sortedByDate = [...outages].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  const services = getAffectedServicesFromOutages(outages);

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Affected Services ({services.length})</h3>
        {services.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {services.map((service) => (
              <span
                key={service}
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#1e293b',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                }}
              >
                {service}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#8798b7', fontSize: '0.875rem' }}>No specific services identified</p>
        )}
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Incident Timeline</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {sortedByDate.map((outage, index) => {
            const date = new Date(outage.published_at);
            const isLatest = index === 0;

            return (
              <div
                key={outage.id}
                className="card outage-timeline__item"
                style={{
                  padding: '1rem',
                  borderLeft: `4px solid ${getStatusColor(outage.status)}`,
                  opacity: isLatest ? 1 : 0.8,
                }}
              >
                <style>{`
                  @media (max-width: 768px) {
                    .outage-timeline__item {
                      padding: 0.95rem !important;
                    }
                    .outage-timeline__row {
                      flex-direction: column;
                    }
                    .outage-timeline__meta {
                      width: 100%;
                      text-align: left !important;
                    }
                    .outage-timeline__status-row {
                      flex-wrap: wrap;
                    }
                  }
                `}</style>

                <div className="outage-timeline__row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div className="outage-timeline__status-row" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: getStatusColor(outage.status),
                        }}
                      >
                        {getStatusIcon(outage.status)}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: getStatusColor(outage.status),
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      >
                        {outage.status}
                      </span>
                      {isLatest && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '3px',
                            fontWeight: 600,
                          }}
                        >
                          LATEST
                        </span>
                      )}
                    </div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 600 }}>{outage.title}</h4>
                    <p style={{ margin: 0, color: '#a2b2cd', fontSize: '0.875rem', lineHeight: 1.5 }}>{outage.summary}</p>
                  </div>
                  <div className="outage-timeline__meta" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.75rem', color: '#8798b7' }}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8798b7' }}>
                      {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
