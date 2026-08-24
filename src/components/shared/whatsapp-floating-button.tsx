'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

/**
 * Fixed bottom-right, well clear of the mobile safe area and never covering
 * form fields or nav. It intentionally sits above the footer/content flow
 * rather than as a full-width bar, so it never blocks a submit button or the
 * property-detail sticky CTA row.
 */
export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <a
      href={buildWhatsAppLink(
        siteConfig.whatsappNumber,
        "Hi, I'd like to know more about properties in Akola.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed z-40 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 md:bottom-6 md:right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft hover:scale-105 active:scale-95 transition-transform"
    >
      <MessageCircle className="h-6 w-6" fill="white" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
