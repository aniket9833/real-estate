import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { supabaseAdmin, PROPERTY_IMAGES_BUCKET } from '../lib/supabase';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB per image, generous for phone camera photos
export const MAX_IMAGES_PER_PROPERTY = 12;

export class UploadValidationError extends Error {}

export interface UploadedImage {
  path: string;
  url: string;
  width: number;
  height: number;
}

function assertValidFile(file: File) {
  if (
    !ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MIME_TYPES)[number],
    )
  ) {
    throw new UploadValidationError(
      `Unsupported file type "${file.type || 'unknown'}". Please upload JPG, PNG, or WEBP images only.`,
    );
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new UploadValidationError(
      `"${file.name}" is larger than the 8MB limit. Please compress the image and try again.`,
    );
  }
}

/**
 * Converts an incoming image to a web-optimized WEBP and uploads it under
 * property-images/{propertyId}/{uuid}.webp. Returns the storage path and a
 * cached public URL so we never need to re-derive it in the app.
 */
export async function uploadPropertyImage(
  propertyId: string,
  file: File,
): Promise<UploadedImage> {
  assertValidFile(file);

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  const optimized = await sharp(inputBuffer)
    .rotate() // respect EXIF orientation from phone cameras
    .resize({
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const filename = `${randomUUID()}.webp`;
  const path = `${propertyId}/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .upload(path, optimized.data, { contentType: 'image/webp', upsert: false });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .getPublicUrl(path);

  return {
    path,
    url: publicUrlData.publicUrl,
    width: optimized.info.width,
    height: optimized.info.height,
  };
}

export async function uploadMultiplePropertyImages(
  propertyId: string,
  files: File[],
): Promise<UploadedImage[]> {
  if (files.length > MAX_IMAGES_PER_PROPERTY) {
    throw new UploadValidationError(
      `You can upload up to ${MAX_IMAGES_PER_PROPERTY} images per property.`,
    );
  }

  const uploaded: UploadedImage[] = [];
  try {
    for (const file of files) {
      // Sequential (not Promise.all) so a mid-batch failure has a known,
      // small set of already-uploaded files to clean up - not a partial mess.
      uploaded.push(await uploadPropertyImage(propertyId, file));
    }
    return uploaded;
  } catch (err) {
    // Roll back everything uploaded in this batch so we never leave orphaned
    // files in Supabase when the overall property save fails.
    await deletePropertyImages(uploaded.map((u) => u.path)).catch(() => {
      /* best-effort cleanup; surfaced failure below is more important */
    });
    throw err;
  }
}

export async function deletePropertyImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await supabaseAdmin.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .remove(paths);
  if (error) {
    throw new Error(`Failed to delete images: ${error.message}`);
  }
}

/** Deletes every file under property-images/{propertyId}/ - used when a property is deleted entirely. */
export async function deleteAllPropertyImages(
  propertyId: string,
): Promise<void> {
  const { data, error } = await supabaseAdmin.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .list(propertyId);
  if (error) {
    throw new Error(`Failed to list images for cleanup: ${error.message}`);
  }
  if (!data || data.length === 0) return;
  const paths = data.map((f) => `${propertyId}/${f.name}`);
  await deletePropertyImages(paths);
}
