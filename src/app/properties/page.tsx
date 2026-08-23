import type { Metadata } from 'next';
import { Home as HomeIcon } from 'lucide-react';
import { listProperties } from '@/services/property.service';
import { PropertyCard } from '@/components/property/property-card';
import { PropertyFilters } from '@/components/property/property-filters';

// Force dynamic rendering rather than requiring a DB connection at build
// time, and so admin edits (publish/unpublish, price changes) show up
// without a full redeploy.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Properties in Akola — Verified Plots & Homes',
  description:
    'Browse verified plots, land, and homes for sale in Akola, Maharashtra.',
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const { items, total, totalPages } = await listProperties({
    type: searchParams.type,
    status: searchParams.status,
    search: searchParams.search,
    page,
    publishedOnly: true,
  });

  return (
    <div className="container section-pad">
      <div className="max-w-2xl">
        <span className="eyebrow">Listings</span>
        <h1 className="mt-2 font-display text-3xl md:text-4xl text-primary">
          Properties in Akola
        </h1>
        <p className="mt-3 text-muted">
          Every listing here has been personally reviewed. Use the filters below
          to find what fits your needs.
        </p>
      </div>

      <div className="mt-8">
        <PropertyFilters />
      </div>

      <p className="mt-6 text-sm text-muted">
        {total} propert{total === 1 ? 'y' : 'ies'} found
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border py-20 text-center">
          <HomeIcon
            className="h-10 w-10 text-muted mx-auto mb-3"
            strokeWidth={1.5}
          />
          <p className="font-display text-lg text-primary">
            No matching properties right now
          </p>
          <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
            Try adjusting your filters, or message us directly — we often know
            about properties before they&apos;re listed.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <a
                key={pageNum}
                href={`?page=${pageNum}${searchParams.type ? `&type=${searchParams.type}` : ''}`}
                className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm border ${
                  pageNum === page
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-ink/70'
                }`}
              >
                {pageNum}
              </a>
            ),
          )}
        </div>
      )}
    </div>
  );
}
