'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Star, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PendingImage {
  file: File;
  previewUrl: string;
}

interface Props {
  name: string; // form field name the Files will be submitted under
  images: PendingImage[];
  onChange: (images: PendingImage[]) => void;
  maxImages?: number;
}

/**
 * Client-side-only staging area: files are held in memory as PendingImage
 * objects and only actually appended to the surrounding <form>'s FormData on
 * submit (via a hidden multi-file input kept in sync below). Nothing is
 * uploaded to Supabase until the whole property form is valid and submitted,
 * per the "don't upload until the record is valid" requirement.
 */
export function ImageUploader({
  name,
  images,
  onChange,
  maxImages = 12,
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList).filter((f) =>
      /image\/(jpeg|png|webp)/.test(f.type),
    );
    const room = maxImages - images.length;
    const accepted = incoming.slice(0, room);
    const next = [
      ...images,
      ...accepted.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ];
    onChange(next);
  }

  function removeAt(index: number) {
    const next = [...images];
    URL.revokeObjectURL(next[index].previewUrl);
    next.splice(index, 1);
    onChange(next);
  }

  function makePrimary(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
          dragActive
            ? 'border-accent bg-accent/5'
            : 'border-border hover:border-accent/50',
        )}
      >
        <Upload className="h-7 w-7 text-muted mx-auto mb-2" />
        <p className="text-sm text-ink">
          <span className="text-primary font-medium">Click to upload</span> or
          drag and drop
        </p>
        <p className="text-xs text-muted mt-1">
          JPG, PNG, or WEBP — up to 8MB each, {maxImages} images max
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <>
          <p className="text-xs text-muted mt-3">
            The first image is your{' '}
            <span className="font-medium text-ink">primary photo</span>. Drag
            the star to change it, or use the arrows to reorder.
          </p>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div
                key={img.previewUrl}
                className="relative rounded-xl overflow-hidden border border-border group"
              >
                <div className="relative aspect-[4/3] bg-primary/5">
                  <Image
                    src={img.previewUrl}
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
                  onClick={() => removeAt(i)}
                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-primary/80 text-white flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between gap-1">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makePrimary(i)}
                      className="text-[0.65rem] bg-surface/90 rounded-full px-2 py-0.5 flex items-center gap-1"
                    >
                      <Star className="h-2.5 w-2.5" /> Make primary
                    </button>
                  )}
                  <div className="ml-auto flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(i, i - 1)}
                      disabled={i === 0}
                      className="h-6 w-6 rounded-full bg-surface/90 flex items-center justify-center disabled:opacity-30"
                      aria-label="Move earlier"
                    >
                      <GripVertical className="h-3 w-3 rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Hidden input kept in sync so the surrounding <form action={...}> picks up the staged files under `name` on submit. */}
      <HiddenFileSync name={name} files={images.map((i) => i.file)} />
    </div>
  );
}

/**
 * FileList objects can't be constructed directly from an array in all
 * browsers via plain assignment, so we use DataTransfer to build one and
 * sync it onto a hidden <input type="file" multiple> each time the staged
 * list changes. This keeps native form submission (and Server Actions) as
 * the single source of truth at submit time.
 */
function HiddenFileSync({ name, files }: { name: string; files: File[] }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    ref.current.files = dt.files;
  }, [files]);

  return (
    <input
      ref={ref}
      type="file"
      name={name}
      multiple
      className="hidden"
      readOnly
    />
  );
}
