'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PROPERTY_TYPE_LABELS } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [showFilters, setShowFilters] = useState(false);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam('search', search || null);
  }

  const activeType = searchParams.get('type') ?? '';
  const activeStatus = searchParams.get('status') ?? '';

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <form onSubmit={onSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location, title…"
            className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </form>
        <Button
          variant="outline"
          size="default"
          onClick={() => setShowFilters((v) => !v)}
          className="sm:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={cn(
          'flex-wrap gap-2 sm:flex',
          showFilters ? 'flex' : 'hidden',
        )}
      >
        <FilterPill
          active={activeType === ''}
          onClick={() => updateParam('type', null)}
        >
          All Types
        </FilterPill>
        {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
          <FilterPill
            key={value}
            active={activeType === value}
            onClick={() => updateParam('type', value)}
          >
            {label}
          </FilterPill>
        ))}
      </div>

      <div
        className={cn(
          'flex-wrap gap-2 sm:flex',
          showFilters ? 'flex' : 'hidden',
        )}
      >
        {['', 'available', 'reserved', 'sold'].map((s) => (
          <FilterPill
            key={s || 'all-status'}
            active={activeStatus === s}
            onClick={() => updateParam('status', s || null)}
          >
            {s ? s[0].toUpperCase() + s.slice(1) : 'Any Status'}
          </FilterPill>
        ))}
      </div>

      {isPending && <p className="text-xs text-muted">Updating results…</p>}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-surface text-ink/70 border-border hover:border-primary/40',
      )}
    >
      {children}
    </button>
  );
}
