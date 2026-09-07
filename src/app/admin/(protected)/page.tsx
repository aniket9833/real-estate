import Link from 'next/link';
import { Building2, CheckCircle2, Clock3, Plus, Tag } from 'lucide-react';
import { getDashboardStats } from '@/services/property.service';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: 'Total Properties', value: stats.total, icon: Building2 },
    { label: 'Available', value: stats.available, icon: CheckCircle2 },
    { label: 'Reserved', value: stats.reserved, icon: Clock3 },
    { label: 'Sold', value: stats.sold, icon: Tag },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Keep your property listings up to date.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add Property
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <Icon className="h-5 w-5 text-accent-dark" />
            <p className="mt-4 text-sm text-muted">{label}</p>
            <p className="mt-1 font-display text-3xl text-primary">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
