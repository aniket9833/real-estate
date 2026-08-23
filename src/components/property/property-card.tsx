import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Ruler } from 'lucide-react';
import { formatINR, formatArea, PROPERTY_TYPE_LABELS } from '@/lib/utils';
import { StatusBadge } from '@/components/property/status-badge';
import { VerifiedStamp } from '@/components/shared/verified-stamp';

export interface PropertyCardData {
  slug: string;
  title: string;
  type: string;
  status: string;
  price: number;
  priceLabel?: string;
  areaValue: number;
  areaUnit: string;
  location: { area: string; city?: string };
  images: { url: string }[];
  documentation?: { verified?: boolean };
  isFeatured?: boolean;
}

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const primaryImage = property.images?.[0]?.url;

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block rounded-2xl border border-border bg-surface overflow-hidden shadow-card hover:shadow-soft transition-shadow"
    >
      <div className="relative aspect-4/3 bg-primary/5 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted text-sm">
            Photo coming soon
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={property.status} />
        </div>
        {property.documentation?.verified && (
          <div className="absolute top-2 right-2 drop-shadow-md">
            <VerifiedStamp size="sm" />
          </div>
        )}
        {property.isFeatured && (
          <div className="absolute bottom-3 left-3 rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-mono uppercase tracking-wider text-accent-foreground">
            Featured
          </div>
        )}
      </div>

      <div className="p-4 md:p-5">
        <div className="flex items-center gap-1.5 text-xs text-muted mb-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {property.location.area}
        </div>
        <h3 className="font-display text-lg text-primary leading-snug line-clamp-2">
          {property.title}
        </h3>
        <p className="mt-1 text-xs font-mono uppercase tracking-wide text-accent-dark">
          {PROPERTY_TYPE_LABELS[property.type] ?? property.type}
        </p>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <div className="text-[0.7rem] text-muted uppercase tracking-wide">
              Price
            </div>
            <div className="font-mono text-base font-medium text-ink">
              {property.priceLabel || formatINR(property.price)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[0.7rem] text-muted uppercase tracking-wide flex items-center gap-1 justify-end">
              <Ruler className="h-3 w-3" /> Area
            </div>
            <div className="font-mono text-sm text-ink">
              {formatArea(property.areaValue, property.areaUnit)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
