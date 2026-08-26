import type { Metadata } from 'next';
import { VerifiedStamp } from '@/components/shared/verified-stamp';
import {
  ShieldCheck,
  MessageSquareText,
  FileCheck2,
  HeartHandshake,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet the consultant behind AVASYA Consultants and our approach to honest, transparent property deals in Akola.',
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Verification First',
    desc: "We take the time to check a property's basics before it's ever shown to a customer.",
  },
  {
    icon: MessageSquareText,
    title: 'Transparent Communication',
    desc: "You'll always know where things stand — no vague answers, no pressure tactics.",
  },
  {
    icon: FileCheck2,
    title: 'Documentation Guidance',
    desc: 'We help you understand the paperwork in plain language, so you feel informed, not overwhelmed.',
  },
  {
    icon: HeartHandshake,
    title: 'Customer-First Philosophy',
    desc: "Our goal is a deal that's right for you — even if that means recommending you wait or look elsewhere.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-primary text-primary-foreground">
        <div className="container section-pad">
          <span className="eyebrow text-accent-light">About Us</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl max-w-2xl leading-tight">
            Local expertise, built on personal trust
          </h1>
          <p className="mt-4 text-primary-foreground/80 max-w-xl leading-relaxed">
            AVASYA Consultants was started with a simple idea: buying land or a
            home in Akola should feel safe, clear, and personal — not confusing
            or rushed.
          </p>
        </div>
      </section>

      <section className="container section-pad grid md:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[4/5] rounded-2xl bg-primary/5 border border-border overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-muted text-sm text-center px-8">
            [ Owner photo placeholder ]
          </div>
        </div>
        <div>
          <span className="eyebrow">The Consultant</span>
          <h2 className="mt-2 font-display text-3xl text-primary">
            A Personal Point of Contact
          </h2>
          <p className="mt-4 text-ink/80 leading-relaxed">
            Every enquiry is handled personally — not passed between departments
            or call centers. We spend time understanding what you actually need,
            whether that&apos;s a residential plot for your family, agricultural
            land as an investment, or a home ready to move into.
          </p>
          <p className="mt-4 text-ink/80 leading-relaxed">
            Having worked closely with properties across Akola and its
            surrounding areas, we&apos;ve built an on-the-ground understanding
            of localities, growth pockets, and the practical realities of land
            transactions in this region — knowledge that&apos;s difficult to get
            from a listings website alone.
          </p>
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="container section-pad">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <span className="eyebrow">Our Approach</span>
              <h2 className="mt-2 font-display text-3xl text-primary">
                How We Handle Every Transaction
              </h2>
              <p className="mt-4 text-ink/80 leading-relaxed">
                Property decisions are significant — often among the biggest a
                family makes. We approach each one with the seriousness it
                deserves: clear information, honest timelines, and guidance
                through the documentation involved, so you always know what
                you&apos;re agreeing to.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <VerifiedStamp size="sm" />
                <p className="text-sm text-muted">
                  Verification and documentation guidance on every listing we
                  share.
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2 relative aspect-[4/3] rounded-2xl bg-primary/5 border border-border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-muted text-sm text-center px-8">
                [ Office photo placeholder ]
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-pad">
        <div className="max-w-xl">
          <span className="eyebrow">What We Stand For</span>
          <h2 className="mt-2 font-display text-3xl text-primary">
            Our Commitments to You
          </h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 gap-8">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="shrink-0 h-11 w-11 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-display text-lg text-primary">{title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
