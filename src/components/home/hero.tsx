import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { VerifiedStamp } from '@/components/shared/verified-stamp';
import { buildWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        className="absolute inset-0 bg-topo bg-repeat opacity-[0.08]"
        aria-hidden
      />
      <div className="container relative section-pad grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="eyebrow text-accent-light">Akola, Maharashtra</span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight">
            Trusted Land & Home
            <br />
            Deals in <span className="italic text-accent-light">Akola</span>
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/80 max-w-xl leading-relaxed">
            {siteConfig.subTagline} {siteConfig.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/properties"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary-foreground px-8 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90"
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-primary-foreground/25 px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <MessageCircle className="h-4 w-4" /> Talk to Us
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <VerifiedStamp size="sm" />
            <p className="text-sm text-primary-foreground/70 max-w-xs leading-snug">
              Every listed property is personally verified before it reaches
              you.
            </p>
          </div>
        </div>

        <div className="relative aspect-4/5 max-w-xl w-full justify-self-center lg:justify-self-end rounded-2xl bg-primary-light/40 border border-primary-foreground/10 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHJlYWwlMjBlc3RhdGUlMjBidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D"
            alt="Modern real estate building"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
