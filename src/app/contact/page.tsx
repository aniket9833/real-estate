import type { Metadata } from 'next';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnquiryForm } from '@/components/shared/enquiry-form';
import { buildWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with AVASYA Consultants — call, WhatsApp, or send an enquiry.',
};

export default function ContactPage() {
  return (
    <div className="container section-pad">
      <div className="max-w-xl">
        <span className="eyebrow">Get in Touch</span>
        <h1 className="mt-2 font-display text-4xl text-primary">
          Let&apos;s Talk About Your Property
        </h1>
        <p className="mt-3 text-muted">
          Reach out however is easiest for you — we typically respond within a
          few hours during office hours.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <ul className="space-y-5">
              <ContactRow icon={Phone} label="Call">
                <a
                  href={`tel:${siteConfig.phoneNumber}`}
                  className="hover:text-primary"
                >
                  {siteConfig.phoneNumber}
                </a>
              </ContactRow>
              <ContactRow icon={MessageCircle} label="WhatsApp">
                <a
                  href={buildWhatsAppLink(
                    siteConfig.whatsappNumber,
                    "Hi, I'd like to get in touch about a property in Akola.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Message us directly
                </a>
              </ContactRow>
              <ContactRow icon={Mail} label="Email">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-primary break-all"
                >
                  {siteConfig.email}
                </a>
              </ContactRow>
              <ContactRow icon={MapPin} label="Office">
                <span>{siteConfig.address}</span>
              </ContactRow>
              <ContactRow icon={Clock} label="Hours">
                <span>{siteConfig.officeHours}</span>
              </ContactRow>
            </ul>

            <Button
              asChild
              variant="whatsapp"
              size="lg"
              className="w-full mt-6"
            >
              <a
                href={buildWhatsAppLink(
                  siteConfig.whatsappNumber,
                  "Hi, I'd like to get in touch about a property in Akola.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </Button>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden aspect-[4/3]">
            <iframe
              src={siteConfig.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office location map"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 h-fit">
          <h2 className="font-display text-xl text-primary mb-5">
            Send an Enquiry
          </h2>
          <EnquiryForm source="contact-form" />
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <div className="shrink-0 h-9 w-9 rounded-full bg-primary/5 flex items-center justify-center text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[0.7rem] uppercase tracking-wide text-muted">
          {label}
        </div>
        <div className="text-sm text-ink mt-0.5">{children}</div>
      </div>
    </li>
  );
}
