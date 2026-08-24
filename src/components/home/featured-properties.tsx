import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  PropertyCard,
  type PropertyCardData,
} from '@/components/property/property-card';

export function FeaturedProperties({
  properties,
}: {
  properties: PropertyCardData[];
}) {
  if (properties.length === 0) return null;

  return (
    <section className="section-pad container">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <span className="eyebrow">Handpicked</span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl text-primary">
            Featured Properties
          </h2>
        </div>
        <Link
          href="/properties"
          className="hidden sm:inline-flex items-center justify-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {properties.map((p) => (
          <PropertyCard key={p.slug} property={p} />
        ))}
      </div>

      <div className="mt-8 sm:hidden">
        <Link
          href="/properties"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          View all Properties <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
