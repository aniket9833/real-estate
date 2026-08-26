import type { Metadata } from 'next';
import {
  MessageCircle,
  LandPlot,
  Home,
  Compass,
  FileCheck2,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Plot buying assistance, documentation guidance, site visits, and investment guidance for property in Akola.',
};

const services = [
  {
    icon: LandPlot,
    title: 'Plot Buying Assistance',
    desc: 'Help identifying suitable residential or investment plots based on your budget, location preference, and purpose.',
  },
  {
    icon: Home,
    title: 'Home & Property Deals',
    desc: 'Assistance exploring available homes and properties that match your requirements around Akola.',
  },
  {
    icon: Compass,
    title: 'Property Guidance',
    desc: "Support in understanding a property's location, characteristics, and relevant transaction considerations.",
  },
  {
    icon: FileCheck2,
    title: 'Documentation Assistance',
    desc: 'Guidance through the documentation and steps typically involved in a property transaction.',
  },
  {
    icon: CalendarCheck,
    title: 'Site Visits',
    desc: 'Coordination of convenient site visits so you can see a property in person before deciding.',
  },
  {
    icon: TrendingUp,
    title: 'Investment Guidance',
    desc: "Help evaluating properties against your goals — whether that's a home to live in or land to hold.",
  },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-primary text-primary-foreground">
        <div className="container section-pad">
          <span className="eyebrow text-accent-light">What We Offer</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl max-w-2xl leading-tight">
            Guidance at Every Step of Your Property Journey
          </h1>
          <p className="mt-4 text-primary-foreground/80 max-w-xl leading-relaxed">
            From the first conversation to the final visit, we&apos;re here to
            make the process clear and manageable.
          </p>
        </div>
      </section>

      <section className="container section-pad">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-surface p-6 hover:shadow-card transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-lg text-primary">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted max-w-2xl">
          Note: We provide guidance and coordination support for property
          transactions. We are not a law firm or financial institution, and
          recommend independent legal and financial advice for final decisions.
        </p>

        <div className="mt-12 rounded-2xl bg-surface border border-border p-8 text-center">
          <h2 className="font-display text-2xl text-primary">
            Not sure where to start?
          </h2>
          <p className="mt-2 text-muted">
            Tell us what you&apos;re looking for and we&apos;ll guide you from
            there.
          </p>
          <a
            href={buildWhatsAppLink(
              siteConfig.whatsappNumber,
              "Hi, I'd like guidance on a property in Akola.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessageCircle className="h-4 w-4" /> Start a Conversation
          </a>
        </div>
      </section>
    </div>
  );
}
