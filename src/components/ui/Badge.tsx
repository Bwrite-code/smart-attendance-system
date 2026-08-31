import type { AttendanceStatus } from '@/data/mockData';

interface BadgeProps {
  status: AttendanceStatus | 'active' | 'ended' | 'passed' | 'failed' | 'info';
  children?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  present: { label: 'Present', classes: 'text-[var(--success)]', dot: 'bg-[var(--success)]' },
  late: { label: 'Late', classes: 'text-[var(--accent)]', dot: 'bg-[var(--accent)]' },
  rejected: { label: 'Rejected', classes: 'text-[var(--danger)]', dot: 'bg-[var(--danger)]' },
  pending: { label: 'Pending', classes: 'text-fg-muted', dot: 'bg-[var(--text-dim)]' },
  active: { label: 'Active', classes: 'text-[var(--accent)]', dot: 'bg-[var(--accent)]' },
  ended: { label: 'Ended', classes: 'text-fg-muted', dot: 'bg-[var(--text-dim)]' },
  passed: { label: 'Passed', classes: 'text-[var(--success)]', dot: 'bg-[var(--success)]' },
  failed: { label: 'Failed', classes: 'text-[var(--danger)]', dot: 'bg-[var(--danger)]' },
  info: { label: 'Info', classes: 'text-fg-muted', dot: 'bg-[var(--text-dim)]' },
};

export function Badge({ status, children, size = 'sm' }: BadgeProps) {
  const cfg = statusConfig[status] ?? statusConfig.info;
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${cfg.classes} ${sizeClass}`}
      style={{ background: status === 'present' || status === 'passed' ? 'var(--success-soft)' : status === 'rejected' || status === 'failed' ? 'var(--danger-soft)' : status === 'late' || status === 'active' ? 'var(--accent-soft)' : 'var(--bg-elevated-2)' }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {children ?? cfg.label}
    </span>
  );
}
