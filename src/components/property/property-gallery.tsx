'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryImage {
  url: string;
  path: string;
}

export function PropertyGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });
  const [lightboxEmblaRef, lightboxEmblaApi] = useEmblaCarousel({
    loop: images.length > 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (lightboxOpen && lightboxEmblaApi) {
      lightboxEmblaApi.scrollTo(selectedIndex, true);
    }
  }, [lightboxOpen, lightboxEmblaApi, selectedIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxOpen(false);
    }
    if (lightboxOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] md:aspect-[16/9] rounded-2xl bg-primary/5 flex items-center justify-center text-muted">
        Photos coming soon
      </div>
    );
  }

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden border border-border">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((img, i) => (
              <div
                key={img.path}
                className="relative flex-[0_0_100%] aspect-[4/3] md:aspect-[16/9]"
              >
                <Image
                  src={img.url}
                  alt={`${title} — photo ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-primary/85 text-primary-foreground px-3 py-1.5 text-xs backdrop-blur-sm"
          aria-label="View full-size images"
        >
          <Expand className="h-3.5 w-3.5" /> {selectedIndex + 1} /{' '}
          {images.length}
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-surface/90 flex items-center justify-center shadow-soft"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-surface/90 flex items-center justify-center shadow-soft"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.path}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'relative h-16 w-20 shrink-0 rounded-lg overflow-hidden border-2',
                i === selectedIndex
                  ? 'border-accent'
                  : 'border-transparent opacity-70',
              )}
              aria-label={`Go to image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-primary/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 h-11 w-11 rounded-full bg-surface/10 hover:bg-surface/20 text-white flex items-center justify-center"
            aria-label="Close full-size view"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="overflow-hidden w-full h-full flex items-center"
            ref={lightboxEmblaRef}
          >
            <div className="flex w-full h-full">
              {images.map((img, i) => (
                <div key={img.path} className="relative flex-[0_0_100%] h-full">
                  <Image
                    src={img.url}
                    alt={`${title} — photo ${i + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={() => lightboxEmblaApi?.scrollPrev()}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-surface/10 hover:bg-surface/20 text-white flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => lightboxEmblaApi?.scrollNext()}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-surface/10 hover:bg-surface/20 text-white flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
