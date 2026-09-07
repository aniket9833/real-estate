import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { VerifiedStamp } from '@/components/shared/verified-stamp';
import { buildWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-end text-primary-foreground">
      {/* Background photograph */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Verified property in Akola"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient scrim for text legibility - darkest at the bottom where the copy sits, fading up toward the nav */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
        <div
          className="absolute inset-0 bg-topo bg-repeat opacity-[0.06]"
          aria-hidden
        />
      </div>

      {/* Content */}
      <div className="container relative pt-40 pb-16 md:pb-20">
        <div className="max-w-2xl animate-fade-up">
          <span className="eyebrow text-accent-light">Akola, Maharashtra</span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.06] tracking-tight text-primary-foreground">
            Trusted Land & Home
            <br />
            Deals in <span className="italic text-accent-light">Akola</span>
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/85 max-w-xl leading-relaxed">
            {siteConfig.subTagline} {siteConfig.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/properties"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-8 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-dark"
            >
              Browse Properties <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={buildWhatsAppLink(
                siteConfig.whatsappNumber,
                "Hi, I'd like to know more about properties in Akola.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/5 backdrop-blur-sm px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/15"
            >
              <MessageCircle className="h-4 w-4" /> Talk to Us
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <VerifiedStamp size="sm" />
            <p className="text-sm text-primary-foreground/75 max-w-xs leading-snug">
              Every listed property is personally verified before it reaches
              you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
