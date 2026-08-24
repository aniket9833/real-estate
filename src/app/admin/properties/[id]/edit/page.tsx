import { notFound } from 'next/navigation';
import type { ComponentProps } from 'react';
import { getPropertyById } from '@/services/property.service';
import { PropertyForm } from '@/components/admin/property-form';
import { ExistingImagesManager } from '@/components/admin/existing-images-manager';

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await getPropertyById(params.id);
  if (!property) notFound();

  const existing = {
    _id: String(property._id),
    title: property.title,
    type: property.type,
    status: property.status,
    description: property.description,
    location: property.location,
    areaValue: property.areaValue,
    areaUnit: property.areaUnit,
    price: property.price,
    priceLabel: property.priceLabel,
    features: property.features as string[],
    documentation: property.documentation,
    isFeatured: property.isFeatured,
    isPublished: property.isPublished,
  } as NonNullable<ComponentProps<typeof PropertyForm>['existing']>;

  return (
    <div>
      <h1 className="font-display text-2xl text-primary mb-1">Edit Property</h1>
      <p className="text-sm text-muted mb-6">{String(property.title)}</p>

      <div className="max-w-3xl mb-8 rounded-2xl border border-border bg-surface p-5 md:p-6">
        <h2 className="font-display text-lg text-primary mb-4">
          Current Photos
        </h2>
        <ExistingImagesManager
          propertyId={existing._id}
          images={
            property.images as ComponentProps<
              typeof ExistingImagesManager
            >['images']
          }
        />
      </div>

      <PropertyForm existing={existing} />
    </div>
  );
}
