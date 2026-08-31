import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-bg-elevated border border-border rounded-lg ${hover ? 'transition-colors hover:border-border-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accent?: 'accent' | 'success' | 'danger' | 'fg';
  sublabel?: string;
}

export function StatCard({ label, value, icon, accent = 'fg', sublabel }: StatCardProps) {
  const accentColors = {
    accent: 'text-accent',
    success: 'text-success',
    danger: 'text-danger',
    fg: 'text-fg',
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-fg-dim uppercase tracking-wider font-medium">{label}</p>
          <p className={`text-3xl font-display font-semibold mt-2 ${accentColors[accent]}`}>{value}</p>
          {sublabel && <p className="text-xs text-fg-dim mt-1">{sublabel}</p>}
        </div>
        {icon && <div className={`w-10 h-10 rounded-lg bg-bg-elevated-2 flex items-center justify-center ${accentColors[accent]}`}>{icon}</div>}
      </div>
    </Card>
  );
}
