'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/session';
import {
  createProperty,
  updateProperty,
  deleteProperty,
  togglePublish,
  toggleFeatured,
  changeStatus,
  setPropertyImages,
  removeSingleImage,
  propertyInputSchema,
} from '@/services/property.service';
import {
  uploadMultiplePropertyImages,
  deleteAllPropertyImages,
} from '@/services/storage.service';

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export interface PropertyFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
  propertyId?: string;
}

type PropertyImage = {
  path: string;
  url: string;
  order: number;
  isPrimary: boolean;
  width?: number;
  height?: number;
  [key: string]: unknown;
};

type PropertyWithImages = {
  images: PropertyImage[];
};

function parsePropertyForm(formData: FormData) {
  return {
    title: String(formData.get('title') || ''),
    type: String(formData.get('type') || ''),
    status: String(formData.get('status') || 'available'),
    description: String(formData.get('description') || ''),
    location: {
      area: String(formData.get('area') || ''),
      city: String(formData.get('city') || 'Akola'),
      district: String(formData.get('district') || 'Akola'),
      state: String(formData.get('state') || 'Maharashtra'),
      landmark: String(formData.get('landmark') || ''),
      mapLink: String(formData.get('mapLink') || ''),
    },
    areaValue: formData.get('areaValue'),
    areaUnit: String(formData.get('areaUnit') || 'sqft'),
    price: formData.get('price'),
    priceLabel: String(formData.get('priceLabel') || ''),
    features: String(formData.get('features') || '')
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean),
    documentation: {
      verified: formData.get('verified') === 'on',
      titleType: String(formData.get('titleType') || ''),
      notes: String(formData.get('docNotes') || ''),
    },
    isFeatured: formData.get('isFeatured') === 'on',
    isPublished: formData.get('isPublished') === 'on',
  };
}

/**
 * Creates the property record first (so we have a stable propertyId to
 * namespace images under in Supabase), then uploads images. If image upload
 * fails partway, the storage service already rolls back its own batch; here
 * we additionally roll back the just-created DB row so we never leave a
 * property with a broken/partial image set dangling in an inconsistent state.
 */
export async function createPropertyAction(
  _prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  await requireAdmin();

  const raw = parsePropertyForm(formData);
  const parsed = propertyInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues)
      fieldErrors[issue.path.join('.')] = issue.message;
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }

  let createdId: string | undefined;
  try {
    const property = await createProperty(parsed.data);
    const newId: string = property._id.toString();
    createdId = newId;

    const files = formData
      .getAll('images')
      .filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > 0) {
      const uploaded = await uploadMultiplePropertyImages(newId, files);
      const images = uploaded.map((img, idx) => ({
        ...img,
        order: idx,
        isPrimary: idx === 0,
      }));
      await setPropertyImages(newId, images);
    }

    revalidatePath('/admin/properties');
    revalidatePath('/properties');
    return { success: true, propertyId: createdId };
  } catch (err) {
    console.error('Create property error:', err);
    if (createdId) {
      // Roll back the orphaned DB row + any images so retrying doesn't leave debris.
      await deleteAllPropertyImages(createdId).catch(() => {});
      await deleteProperty(createdId).catch(() => {});
    }
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Could not create the property. Please try again.',
    };
  }
}

export async function updatePropertyAction(
  id: string,
  _prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  await requireAdmin();

  const raw = parsePropertyForm(formData);
  const parsed = propertyInputSchema.partial().safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues)
      fieldErrors[issue.path.join('.')] = issue.message;
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }

  try {
    await updateProperty(id, parsed.data);

    const files = formData
      .getAll('newImages')
      .filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > 0) {
      const uploaded = await uploadMultiplePropertyImages(id, files);
      const { getPropertyById } = await import('@/services/property.service');
      const existing = (await getPropertyById(id)) as PropertyWithImages | null;
      const existingImages = existing?.images ?? [];
      const combined = [
        ...existingImages,
        ...uploaded.map((img, idx) => ({
          ...img,
          order: existingImages.length + idx,
          isPrimary: existingImages.length === 0 && idx === 0,
        })),
      ];
      await setPropertyImages(id, combined);
    }

    revalidatePath('/admin/properties');
    revalidatePath(`/admin/properties/${id}/edit`);
    revalidatePath('/properties');
    return { success: true, propertyId: id };
  } catch (err) {
    console.error('Update property error:', err);
    return {
      error:
        err instanceof Error
          ? err.message
          : 'Could not update the property. Please try again.',
    };
  }
}

export async function deletePropertyAction(id: string) {
  await requireAdmin();
  await deleteProperty(id);
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
  redirect('/admin/properties');
}

export async function togglePublishAction(id: string, isPublished: boolean) {
  await requireAdmin();
  await togglePublish(id, isPublished);
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
}

export async function toggleFeaturedAction(id: string, isFeatured: boolean) {
  await requireAdmin();
  await toggleFeatured(id, isFeatured);
  revalidatePath('/admin/properties');
  revalidatePath('/');
}

export async function changeStatusAction(
  id: string,
  status: 'available' | 'reserved' | 'sold',
) {
  await requireAdmin();
  await changeStatus(id, status);
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
}

export async function removeImageAction(propertyId: string, imagePath: string) {
  await requireAdmin();
  await removeSingleImage(propertyId, imagePath);
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}

export async function reorderImagesAction(
  propertyId: string,
  orderedPaths: string[],
) {
  await requireAdmin();
  const { getPropertyById } = await import('@/services/property.service');
  const property = (await getPropertyById(
    propertyId,
  )) as PropertyWithImages | null;
  if (!property) throw new Error('Property not found');
  const byPath = new Map(property.images.map((img) => [img.path, img]));
  const reordered = orderedPaths.flatMap((path, idx) => {
    const image = byPath.get(path);
    if (!image) return [];
    return [
      {
        path: image.path,
        url: image.url,
        width: image.width,
        height: image.height,
        order: idx,
        isPrimary: idx === 0,
      },
    ];
  });
  await setPropertyImages(propertyId, reordered);
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}
