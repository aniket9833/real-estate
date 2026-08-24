'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Star, X, Loader2 } from 'lucide-react';
import {
  removeImageAction,
  reorderImagesAction,
} from '@/actions/property.actions';

interface ExistingImage {
  path: string;
  url: string;
  isPrimary: boolean;
}

export function ExistingImagesManager({
  propertyId,
  images,
}: {
  propertyId: string;
  images: ExistingImage[];
}) {
  const [localImages, setLocalImages] = useState(images);
  const [isPending, startTransition] = useTransition();
  const [removingPath, setRemovingPath] = useState<string | null>(null);

  function handleRemove(path: string) {
    setRemovingPath(path);
    startTransition(async () => {
      await removeImageAction(propertyId, path);
      setLocalImages((prev) => prev.filter((i) => i.path !== path));
      setRemovingPath(null);
    });
  }

  function handleMakePrimary(index: number) {
    if (index === 0) return;
    const next = [...localImages];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    setLocalImages(next);
    startTransition(() =>
      reorderImagesAction(
        propertyId,
        next.map((i) => i.path),
      ),
    );
  }

  if (localImages.length === 0) {
    return (
      <p className="text-sm text-muted">
        No photos uploaded yet. Add some below.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {localImages.map((img, i) => (
        <div
          key={img.path}
          className="relative rounded-xl overflow-hidden border border-border"
        >
          <div className="relative aspect-[4/3] bg-primary/5">
            <Image
              src={img.url}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
          {i === 0 && (
            <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-medium text-accent-foreground">
              <Star className="h-2.5 w-2.5 fill-current" /> Primary
            </span>
          )}
          <button
            type="button"
            onClick={() => handleRemove(img.path)}
            disabled={isPending}
            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-primary/80 text-white flex items-center justify-center"
            aria-label="Delete image"
          >
            {removingPath === img.path ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
          </button>
          {i !== 0 && (
            <button
              type="button"
              onClick={() => handleMakePrimary(i)}
              disabled={isPending}
              className="absolute bottom-1.5 left-1.5 text-[0.65rem] bg-surface/90 rounded-full px-2 py-0.5 flex items-center gap-1"
            >
              <Star className="h-2.5 w-2.5" /> Make primary
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
