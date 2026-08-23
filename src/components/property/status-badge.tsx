import { cn } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/utils';

const dotColor: Record<string, string> = {
  available: 'bg-status-available',
  reserved: 'bg-status-reserved',
  sold: 'bg-status-sold',
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1 text-xs font-medium text-ink shadow-sm border border-border',
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotColor[status])} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
