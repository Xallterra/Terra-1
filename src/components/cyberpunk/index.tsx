/**
 * CYBERPUNK UTILITY COMPONENTS
 * Reusable building blocks for cyberpunk UI
 */

import React from 'react';

// Glass Panel - Frosted glass effect backdrop
export function GlassPanel({
  children,
  className = '',
  neonBorder = 'primary',
  hover = true,
  glowIntensity = 'md',
}: {
  children: React.ReactNode;
  className?: string;
  neonBorder?: 'primary' | 'secondary' | 'accent' | 'none';
  hover?: boolean;
  glowIntensity?: 'sm' | 'md' | 'lg';
}) {
  const borderClass = {
    primary: 'neon-border',
    secondary: 'neon-border-secondary',
    accent: 'neon-border-accent',
    none: '',
  }[neonBorder];

  const glowMap = {
    sm: '0 0 12px rgba(0, 240, 255, 0.08)',
    md: '0 0 18px rgba(0, 240, 255, 0.12)',
    lg: '0 0 28px rgba(0, 240, 255, 0.18)',
  };

  return (
    <div
      className={`glass-panel ${borderClass} ${hover ? 'glass-panel-hover' : ''} ${className}`}
      style={{
        background: 'rgba(15, 22, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease-out',
        boxShadow: glowMap[glowIntensity],
      }}
    >
      {children}
    </div>
  );
}

// Neon Glow Text
export function NeonText({
  children,
  variant = 'primary',
  glow = true,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  glow?: boolean;
}) {
  const colorMap = {
    primary: '#00f0ff',
    secondary: '#ff006e',
    accent: '#b700ff',
    success: '#39ff14',
    warning: '#ffd60a',
    danger: '#ff0000',
  };

  const glowMap = {
    primary: '0 0 10px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.5)',
    secondary: '0 0 10px #ff006e, 0 0 20px rgba(255, 0, 110, 0.5)',
    accent: '0 0 10px #b700ff, 0 0 20px rgba(183, 0, 255, 0.5)',
    success: '0 0 10px #39ff14, 0 0 20px rgba(57, 255, 20, 0.5)',
    warning: '0 0 10px #ffd60a, 0 0 20px rgba(255, 214, 10, 0.5)',
    danger: '0 0 10px #ff0000, 0 0 20px rgba(255, 0, 0, 0.5)',
  };

  return (
    <span
      style={{
        color: colorMap[variant],
        textShadow: glow ? glowMap[variant] : 'none',
        letterSpacing: '0.5px',
      }}
    >
      {children}
    </span>
  );
}

// Neon Badge
export function NeonBadge({
  label,
  variant = 'neon',
  icon = '',
}: {
  label: string;
  variant?: 'neon' | 'success' | 'warning' | 'danger' | 'accent';
  icon?: string;
}) {
  const badgeClass = `badge badge-${variant}`;

  return (
    <span className={badgeClass} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {icon} {label}
    </span>
  );
}

// Loading Pulse - Animated loading indicator
export function LoadingPulse({
  size = 'md',
  text = 'Loading...',
}: {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}) {
  const sizeMap = { sm: '2rem', md: '3rem', lg: '4rem' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: '50%',
          border: '2px solid rgba(0, 240, 255, 0.2)',
          borderTop: '2px solid #00f0ff',
          animation: 'spin 1s linear infinite',
        }}
      />
      {text && <p style={{ color: '#a0a0c0', fontSize: '0.9rem' }}>{text}</p>}
    </div>
  );
}

// Scan Line - Terminal-like scan effect overlay
export function ScanLineOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 240, 255, 0.05) 50%, transparent 100%)',
        animation: 'scan-lines 3s linear infinite',
        pointerEvents: 'none',
      }}
    />
  );
}

// Data Grid Header - Stylized table header
export function DataGridHeader({
  columns,
}: {
  columns: string[];
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
        gap: '1rem',
        padding: '1rem',
        borderBottom: '2px solid rgba(0, 240, 255, 0.3)',
        background: 'rgba(0, 240, 255, 0.05)',
        borderRadius: '4px 4px 0 0',
      }}
    >
      {columns.map((col, i) => (
        <div key={i} style={{ fontWeight: 600, color: '#00f0ff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {col}
        </div>
      ))}
    </div>
  );
}

// Status Indicator - Animated status dot
export function StatusIndicator({
  status = 'active',
  label = '',
}: {
  status?: 'active' | 'inactive' | 'warning' | 'error';
  label?: string;
}) {
  const statusColors = {
    active: '#39ff14',
    inactive: '#707090',
    warning: '#ffd60a',
    error: '#ff0000',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: statusColors[status],
          boxShadow: `0 0 8px ${statusColors[status]}`,
          animation: status === 'active' ? 'pulse 2s ease-in-out infinite' : 'none',
        }}
      />
      {label && <span style={{ color: '#a0a0c0', fontSize: '0.85rem' }}>{label}</span>}
    </div>
  );
}

// Glow Card - Card with hover glow effect
export function GlowCard({
  children,
  variant = 'primary',
  onClick,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  onClick?: () => void;
}) {
  const variantStyles = {
    primary: {
      borderColor: 'rgba(0, 240, 255, 0.3)',
      glowColor: 'rgba(0, 240, 255, 0.2)',
    },
    secondary: {
      borderColor: 'rgba(255, 0, 110, 0.3)',
      glowColor: 'rgba(255, 0, 110, 0.2)',
    },
    accent: {
      borderColor: 'rgba(183, 0, 255, 0.3)',
      glowColor: 'rgba(183, 0, 255, 0.2)',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(15, 22, 39, 0.8)',
        border: `1px solid ${style.borderColor}`,
        borderRadius: '8px',
        padding: '1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-out',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = style.borderColor.replace('0.3', '0.8');
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${style.glowColor}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = style.borderColor;
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {children}
    </div>
  );
}

// Divider - Neon styled divider
export function NeonDivider({ variant = 'primary' }: { variant?: 'primary' | 'secondary' | 'accent' }) {
  const colorMap = {
    primary: 'rgba(0, 240, 255, 0.3)',
    secondary: 'rgba(255, 0, 110, 0.3)',
    accent: 'rgba(183, 0, 255, 0.3)',
  };

  return <div style={{ height: '1px', background: colorMap[variant], margin: '1.5rem 0' }} />;
}

// Alert Box - Status alert box
export function AlertBox({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
}: {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}) {
  const typeStyles = {
    info: { bg: 'rgba(0, 240, 255, 0.1)', border: '#00f0ff', icon: 'ℹ️' },
    success: { bg: 'rgba(57, 255, 20, 0.1)', border: '#39ff14', icon: '✓' },
    warning: { bg: 'rgba(255, 214, 10, 0.1)', border: '#ffd60a', icon: '⚠' },
    error: { bg: 'rgba(255, 0, 0, 0.1)', border: '#ff0000', icon: '⚠' },
  };

  const style = typeStyles[type];

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '6px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'start',
        gap: '1rem',
        marginBottom: '1rem',
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{style.icon}</span>
      <div style={{ flex: 1 }}>
        {title && <h4 style={{ margin: '0 0 0.25rem 0', color: style.border }}>{title}</h4>}
        <p style={{ margin: 0, color: '#a0a0c0', fontSize: '0.9rem' }}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: style.border,
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// Animate on scroll helper - Fade in on scroll
export function FadeInOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            (entry.target as HTMLElement).style.animation = 'fadeIn 0.6s ease-out forwards';
          }, delay);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        animation: 'none',
      }}
    >
      {children}
    </div>
  );
}
