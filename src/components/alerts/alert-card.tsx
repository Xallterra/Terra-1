'use client';

import Link from 'next/link';
import { AlertItem } from '@/types/alert';
import { SeverityBadge } from './severity-badge';
import { StatusBadge } from './status-badge';

function getCategoryBadgeStyle(category: string): { borderColor: string; baseGlow: string; color: string; glowColor: string } {
  switch (category.toLowerCase()) {
    case 'vulnerability':
    case 'security advisory':
      return {
        borderColor: '#ff6b35',
        baseGlow: 'rgba(255, 107, 53, 0.3)',
        color: '#ff9d6b',
        glowColor: '0 0 20px rgba(255, 107, 53, 0.4)',
      };
    case 'outage':
      return {
        borderColor: '#ff0055',
        baseGlow: 'rgba(255, 0, 85, 0.3)',
        color: '#ff4477',
        glowColor: '0 0 20px rgba(255, 0, 85, 0.4)',
      };
    case 'microsoft update':
      return {
        borderColor: '#0099ff',
        baseGlow: 'rgba(0, 153, 255, 0.3)',
        color: '#00ccff',
        glowColor: '0 0 20px rgba(0, 153, 255, 0.4)',
      };
    default:
      return {
        borderColor: '#00f0ff',
        baseGlow: 'rgba(0, 240, 255, 0.3)',
        color: '#00f0ff',
        glowColor: '0 0 20px rgba(0, 240, 255, 0.4)',
      };
  }
}

export function AlertCard({ alert }: { alert: AlertItem }) {
  const date = new Date(alert.published_at).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const badgeStyle = getCategoryBadgeStyle(alert.category);

  return (
    <article
      style={{
        background: 'linear-gradient(135deg, rgba(15, 22, 39, 0.9), rgba(25, 35, 55, 0.8))',
        borderLeft: `4px solid ${badgeStyle.borderColor}`,
        border: `1px solid ${badgeStyle.borderColor}`,
        borderLeftWidth: '4px',
        borderRadius: '8px',
        padding: '1.5rem',
        display: 'grid',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = badgeStyle.borderColor;
        el.style.boxShadow = badgeStyle.glowColor;
        el.style.background = `linear-gradient(135deg, rgba(15, 22, 39, 1), rgba(25, 45, 75, 0.9))`;
        el.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = badgeStyle.borderColor;
        el.style.boxShadow = 'none';
        el.style.background = 'linear-gradient(135deg, rgba(15, 22, 39, 0.9), rgba(25, 35, 55, 0.8))';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Scan line effect on hover */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${badgeStyle.borderColor}, transparent)`,
          opacity: 0,
          animation: 'none',
          transition: 'opacity 0.3s ease-out',
        }}
      />

      {/* Badge section */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <span
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            border: `1px solid ${badgeStyle.borderColor}`,
            background: badgeStyle.baseGlow,
            color: badgeStyle.color,
            textShadow: `0 0 8px ${badgeStyle.borderColor}`,
          }}
        >
          {alert.category}
        </span>
        {alert.severity && <SeverityBadge severity={alert.severity} />}
        {alert.status && <StatusBadge status={alert.status} />}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontSize: '1.1rem',
          lineHeight: 1.4,
          color: '#e0e8ff',
          fontWeight: 600,
          transition: 'color 0.3s ease-out',
        }}
      >
        {alert.title}
      </h3>

      {/* Summary */}
      <p
        style={{
          margin: 0,
          color: '#a0a8c0',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {alert.summary}
      </p>

      {/* Footer with timestamp and link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <time
          style={{
            fontSize: '0.8rem',
            color: '#707090',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
          }}
        >
          {date}
        </time>
        <Link
          href={`/alerts/${alert.slug}`}
          style={{
            color: badgeStyle.color,
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all 0.3s ease-out',
            textShadow: `0 0 10px ${badgeStyle.baseGlow}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textShadow = badgeStyle.glowColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textShadow = `0 0 10px ${badgeStyle.baseGlow}`;
          }}
        >
          Details <span style={{ fontSize: '0.9rem' }}>{'->'}</span>
        </Link>
      </div>
    </article>
  );
}
