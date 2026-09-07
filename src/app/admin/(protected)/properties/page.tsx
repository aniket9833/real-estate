import Link from 'next/link';
import { Building2, Plus } from 'lucide-react';
import { listProperties } from '@/services/property.service';
import { formatArea, formatINR, PROPERTY_TYPE_LABELS } from '@/lib/utils';
import { PropertyRowActions } from '@/components/admin/property-row-actions';
import { StatusBadge } from '@/components/property/status-badge';

export default async function AdminPropertiesPage() {
  const { items, total } = await listProperties({
    publishedOnly: false,
    pageSize: 100,
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-primary">Properties</h1>
          <p className="mt-1 text-sm text-muted">{total} total properties</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add Property
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <Building2 className="mx-auto mb-3 h-10 w-10 text-muted" strokeWidth={1.5} />
          <p className="font-display text-lg text-primary">No properties yet</p>
          <p className="mt-1 text-sm text-muted">
            Add your first property to start building the listings.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-primary/5 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((property) => (
                <tr key={property._id.toString()} className="border-t border-border">
                  <td className="px-4 py-4">
                    <p className="font-medium text-primary">{property.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {property.location.area} · {PROPERTY_TYPE_LABELS[property.type]} ·{' '}
                      {formatArea(property.areaValue, property.areaUnit)}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-ink">
                    {property.priceLabel || formatINR(property.price)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={property.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end">
                      <PropertyRowActions
                        id={property._id.toString()}
                        title={property.title}
                        isPublished={property.isPublished}
                        isFeatured={property.isFeatured}
                        status={property.status}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
