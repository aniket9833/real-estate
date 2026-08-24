'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle } from 'lucide-react';
import { cn, buildWhatsAppLink } from '@/lib/utils';
import { siteConfig, navLinks } from '@/lib/site-config';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isAdmin = pathname?.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-accent-light font-display text-lg italic">
            A
          </span>
          <span className="font-display text-lg md:text-xl text-primary leading-none">
            AVASYA
            <span className="block text-[0.65rem] font-sans tracking-[0.18em] uppercase text-muted mt-0.5 not-italic">
              Consultants
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-[0.95rem] font-medium text-ink/80 hover:text-primary transition-colors relative py-1',
                pathname === link.href &&
                  'text-primary after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-accent',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            variant="default"
            size="default"
            onClick={() =>
              window.open(
                buildWhatsAppLink(
                  siteConfig.whatsappNumber,
                  "Hi, I'd like to know more about properties in Akola.",
                ),
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            <MessageCircle className="h-4 w-4" />
            Get in Touch
          </Button>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-primary"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-up">
          <nav className="container flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'py-3 text-base font-medium border-b border-border/60 last:border-0 text-ink/80',
                  pathname === link.href && 'text-primary',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="default"
              size="lg"
              className="mt-4 w-full"
              onClick={() =>
                window.open(
                  buildWhatsAppLink(
                    siteConfig.whatsappNumber,
                    "Hi, I'd like to know more about properties in Akola.",
                  ),
                  '_blank',
                  'noopener,noreferrer',
                )
              }
            >
              <MessageCircle className="h-4 w-4" />
              Get in Touch on WhatsApp
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
