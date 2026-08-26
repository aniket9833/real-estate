import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Ruler, Tag, FileText, ExternalLink } from 'lucide-react';
import {
  getPropertyBySlug,
  incrementViewCount,
} from '@/services/property.service';
import { formatINR, formatArea, PROPERTY_TYPE_LABELS } from '@/lib/utils';
import { StatusBadge } from '@/components/property/status-badge';
import { VerifiedStamp } from '@/components/shared/verified-stamp';
import { PropertyGallery } from '@/components/property/property-gallery';
import { PropertyCTA } from '@/components/property/property-cta';

interface PropertyDetail {
  _id: { toString(): string };
  title: string;
  type: keyof typeof PROPERTY_TYPE_LABELS;
  status: 'available' | 'reserved' | 'sold';
  description: string;
  location: {
    area: string;
    city: string;
    landmark?: string;
    mapLink?: string;
  };
  areaValue: number;
  areaUnit: 'sqft' | 'acre' | 'gunta' | 'hectare';
  price: number;
  priceLabel?: string;
  features: string[];
  documentation?: {
    verified?: boolean;
    titleType?: string;
    notes?: string;
  };
  images: Array<{ url: string; path: string }>;
}

// Force dynamic rendering rather than requiring a DB connection at build
// time, and so admin edits (publish/unpublish, price changes) show up
// without a full redeploy.
export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = (await getPropertyBySlug(
    params.slug,
  )) as PropertyDetail | null;
  if (!property) return { title: 'Property Not Found' };

  const description = `${PROPERTY_TYPE_LABELS[property.type]} in ${property.location.area}, Akola — ${formatArea(
    property.areaValue,
    property.areaUnit,
  )}. ${property.description.slice(0, 120)}`;

  return {
    title: property.title,
    description,
    openGraph: {
      title: property.title,
      description,
      images: property.images?.[0]?.url ? [property.images[0].url] : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const property = (await getPropertyBySlug(
    params.slug,
  )) as PropertyDetail | null;
  if (!property) notFound();

  incrementViewCount(property._id.toString()).catch(() => {});

  const areaLabel = formatArea(property.areaValue, property.areaUnit);

  return (
    <div className="container section-pad">
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10">
        <div>
          <PropertyGallery images={property.images} title={property.title} />

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <StatusBadge status={property.status} />
              {property.documentation?.verified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-dark border border-accent/30">
                  <VerifiedStamp
                    size="sm"
                    className="h-4! w-4! [&_svg]:h-4! [&_svg]:w-4!"
                  />{' '}
                  Verified Property
                </span>
              )}
              <span className="text-xs font-mono uppercase tracking-wide text-accent-dark">
                {PROPERTY_TYPE_LABELS[property.type]}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-primary leading-tight">
              {property.title}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-muted">
              <MapPin className="h-4 w-4" />
              {property.location.area}, {property.location.city}
              {property.location.landmark
                ? ` — near ${property.location.landmark}`
                : ''}
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatBlock
                label="Price"
                value={property.priceLabel || formatINR(property.price)}
              />
              <StatBlock
                label="Area"
                value={areaLabel}
                icon={<Ruler className="h-3.5 w-3.5" />}
              />
              <StatBlock
                label="Type"
                value={PROPERTY_TYPE_LABELS[property.type]}
                icon={<Tag className="h-3.5 w-3.5" />}
              />
            </div>

            <div className="mt-8">
              <h2 className="font-display text-xl text-primary">
                About This Property
              </h2>
              <p className="mt-2 text-ink/85 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {property.features?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl text-primary">Features</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.features.map((f: string) => (
                    <span
                      key={f}
                      className="rounded-full bg-primary/5 px-3 py-1.5 text-sm text-ink/80"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-display text-xl text-primary flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent-dark" /> Documentation
              </h2>
              <p className="mt-2 text-sm text-ink/80 leading-relaxed">
                {property.documentation?.titleType && (
                  <>
                    <span className="font-medium">Title status: </span>
                    {property.documentation.titleType}
                    <br />
                  </>
                )}
                {property.documentation?.notes ||
                  'Documentation details will be shared and explained during your enquiry.'}
              </p>
              <p className="mt-3 text-xs text-muted">
                This information is provided as guidance. We recommend
                independent legal verification before any transaction.
              </p>
            </div>

            {property.location.mapLink && (
              <a
                href={property.location.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-4"
              >
                View location on Google Maps{' '}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <PropertyCTA
            propertyId={property._id.toString()}
            title={property.title}
            areaLabel={areaLabel}
          />
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3.5">
      <div className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-wide text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-mono text-sm md:text-base text-ink">
        {value}
      </div>
    </div>
  );
}
