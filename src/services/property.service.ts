import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import {
  deleteAllPropertyImages,
  deletePropertyImages,
} from '@/services/storage.service';
import { z } from 'zod';

export const propertyInputSchema = z.object({
  title: z.string().min(4, 'Title is too short').max(140),
  type: z.enum([
    'residential-plot',
    'agricultural-land',
    'commercial-plot',
    'house',
    'flat',
    'row-house',
  ]),
  status: z.enum(['available', 'reserved', 'sold']).default('available'),
  description: z
    .string()
    .min(20, 'Please add a fuller description (min 20 characters)')
    .max(4000),
  location: z.object({
    area: z.string().min(2),
    city: z.string().default('Akola'),
    district: z.string().default('Akola'),
    state: z.string().default('Maharashtra'),
    landmark: z.string().optional(),
    mapLink: z.string().url().optional().or(z.literal('')),
  }),
  areaValue: z.coerce.number().positive('Area must be greater than 0'),
  areaUnit: z.enum(['sqft', 'acre', 'gunta', 'hectare']).default('sqft'),
  price: z.coerce.number().nonnegative(),
  priceLabel: z.string().optional(),
  features: z.array(z.string()).default([]),
  documentation: z.object({
    verified: z.boolean().default(false),
    titleType: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;

type PropertyImage = {
  path: string;
  url: string;
  order: number;
  isPrimary: boolean;
  width?: number;
  height?: number;
};

function slugify(title: string, suffix: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base}-${suffix}`;
}

export interface PropertyListFilters {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featuredOnly?: boolean;
  publishedOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export async function listProperties(filters: PropertyListFilters = {}) {
  await connectDB();
  const {
    type,
    status,
    minPrice,
    maxPrice,
    search,
    featuredOnly,
    publishedOnly = true,
    page = 1,
    pageSize = 12,
  } = filters;

  const query: Record<string, unknown> = {};
  if (publishedOnly) query.isPublished = true;
  if (type) query.type = type;
  if (status) query.status = status;
  if (featuredOnly) query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {
      ...(minPrice ? { $gte: minPrice } : {}),
      ...(maxPrice ? { $lte: maxPrice } : {}),
    };
  }
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    Property.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Property.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPropertyBySlug(
  slug: string,
  opts: { includeUnpublished?: boolean } = {},
) {
  await connectDB();
  const query: Record<string, unknown> = { slug };
  if (!opts.includeUnpublished) query.isPublished = true;
  // Mongoose's lean() typing can't disambiguate the single-doc overload from
  // the array overload through the `models.X || model(...)` pattern, so we
  // cast at this boundary rather than fight the generics. Runtime shape is
  // exactly what the schema defines.
  return Property.findOne(query).lean() as unknown as Promise<Record<
    string,
    unknown
  > | null>;
}

export async function getPropertyById(id: string) {
  await connectDB();
  return Property.findById(id).lean() as unknown as Promise<Record<
    string,
    unknown
  > | null>;
}

export async function incrementViewCount(id: string) {
  await connectDB();
  await Property.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
}

export async function createProperty(input: PropertyInput) {
  await connectDB();
  const data = propertyInputSchema.parse(input);
  const slug = slugify(data.title, Math.random().toString(36).slice(2, 7));
  const property = await Property.create({ ...data, slug, images: [] });
  return property.toObject();
}

export async function updateProperty(
  id: string,
  input: Partial<PropertyInput>,
) {
  await connectDB();
  const partialSchema = propertyInputSchema.partial();
  const data = partialSchema.parse(input);
  const property = await Property.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!property) throw new Error('Property not found');
  return property.toObject();
}

export async function setPropertyImages(
  id: string,
  images: Array<{
    path: string;
    url: string;
    order: number;
    isPrimary: boolean;
    width?: number;
    height?: number;
  }>,
) {
  await connectDB();
  const property = await Property.findByIdAndUpdate(
    id,
    { images },
    { new: true },
  );
  if (!property) throw new Error('Property not found');
  return property.toObject();
}

export async function togglePublish(id: string, isPublished: boolean) {
  await connectDB();
  const property = await Property.findByIdAndUpdate(
    id,
    { isPublished },
    { new: true },
  );
  if (!property) throw new Error('Property not found');
  return property.toObject();
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  await connectDB();
  const property = await Property.findByIdAndUpdate(
    id,
    { isFeatured },
    { new: true },
  );
  if (!property) throw new Error('Property not found');
  return property.toObject();
}

export async function changeStatus(
  id: string,
  status: 'available' | 'reserved' | 'sold',
) {
  await connectDB();
  const property = await Property.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );
  if (!property) throw new Error('Property not found');
  return property.toObject();
}

/**
 * Deletes a property and all of its images from Supabase Storage.
 * Order matters: we delete storage first. If storage deletion fails we abort
 * *before* touching MongoDB, so we never end up with a DB record pointing at
 * images that might still exist, nor do we delete the DB row while images
 * silently survive as orphans - the caller gets a clear error either way.
 */
export async function deleteProperty(id: string) {
  await connectDB();
  const property = await Property.findById(id);
  if (!property) throw new Error('Property not found');

  try {
    await deleteAllPropertyImages(id);
  } catch (err) {
    throw new Error(
      `Could not delete this property's images from storage, so the property was not deleted either. Please try again. (${(err as Error).message})`,
    );
  }

  await Property.findByIdAndDelete(id);
}

export async function removeSingleImage(propertyId: string, imagePath: string) {
  await connectDB();
  await deletePropertyImages([imagePath]);
  const property = await Property.findById(propertyId);
  if (!property) throw new Error('Property not found');
  property.images = property.images.filter(
    (img: PropertyImage) => img.path !== imagePath,
  );
  // Re-assign primary if we just removed it
  if (
    property.images.length > 0 &&
    !property.images.some((img: PropertyImage) => img.isPrimary)
  ) {
    property.images[0].isPrimary = true;
  }
  await property.save();
  return property.toObject();
}

export async function getDashboardStats() {
  await connectDB();
  const [total, available, sold, reserved] = await Promise.all([
    Property.countDocuments({}),
    Property.countDocuments({ status: 'available' }),
    Property.countDocuments({ status: 'sold' }),
    Property.countDocuments({ status: 'reserved' }),
  ]);
  return { total, available, sold, reserved };
}
