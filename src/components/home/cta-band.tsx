import { MessageCircle, Phone } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { buildWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

export function CtaBand() {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground px-6 py-14 md:px-16 md:py-16 text-center">
          <div
            className="absolute inset-0 bg-topo bg-repeat opacity-[0.07]"
            aria-hidden
          />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl">
              Have a Property in Mind?
            </h2>
            <p className="mt-3 text-primary-foreground/75 max-w-md mx-auto">
              Reach out and we&apos;ll help you take the next step — safely and
              clearly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                className={buttonVariants({ variant: 'whatsapp', size: 'lg' })}
                href={buildWhatsAppLink(
                  siteConfig.whatsappNumber,
                  "Hi, I'd like to know more about properties in Akola.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
              <a
                className={`${buttonVariants({ variant: 'outline', size: 'lg' })} border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10`}
                href={`tel:${siteConfig.phoneNumber}`}
              >
                <Phone className="h-4 w-4" /> Call {siteConfig.phoneNumber}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
