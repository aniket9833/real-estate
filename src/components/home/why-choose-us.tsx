import {
  ShieldCheck,
  MapPinned,
  MessageSquareText,
  FileCheck2,
  UserCheck,
  Handshake,
} from 'lucide-react';

const points = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    desc: "Every property is personally checked before it's shown to you — no surprises later.",
  },
  {
    icon: MapPinned,
    title: 'Local Akola Knowledge',
    desc: "Years of on-ground familiarity with Akola's localities, growth areas, and land records.",
  },
  {
    icon: MessageSquareText,
    title: 'Clear Communication',
    desc: 'Straightforward answers about price, condition, and status — always reachable on call or WhatsApp.',
  },
  {
    icon: FileCheck2,
    title: 'Documentation Guidance',
    desc: 'We help you understand the paperwork involved, step by step, in plain language.',
  },
  {
    icon: UserCheck,
    title: 'Personal Assistance',
    desc: 'One point of contact throughout — from first enquiry to the final visit.',
  },
  {
    icon: Handshake,
    title: 'Customer-Focused Approach',
    desc: "We work for your interests, not to push a sale. If it's not right for you, we'll say so.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-pad bg-surface border-y border-border">
      <div className="container">
        <div className="max-w-xl">
          <span className="eyebrow">Why Us</span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl text-primary">
            Built on Trust, Not Just Transactions
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {points.map(({ icon: Icon, title, desc }) => (
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
      </div>
    </section>
  );
}
