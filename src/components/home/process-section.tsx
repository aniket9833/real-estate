const steps = [
  {
    n: '01',
    title: "Tell Us What You're Looking For",
    desc: 'Share your budget, purpose, and preferred location around Akola.',
  },
  {
    n: '02',
    title: 'We Shortlist Suitable Properties',
    desc: 'We match you with verified properties that fit your needs — no time wasted on irrelevant options.',
  },
  {
    n: '03',
    title: 'Understand the Property & Documents',
    desc: 'We walk you through the property details and the relevant documentation involved.',
  },
  {
    n: '04',
    title: 'Visit the Property',
    desc: 'We coordinate a convenient site visit so you can see the property in person.',
  },
  {
    n: '05',
    title: 'Proceed With the Transaction',
    desc: 'With clarity on the property and paperwork, you move forward with confidence.',
  },
];

export function ProcessSection() {
  return (
    <section className="section-pad container">
      <div className="max-w-xl mx-auto text-center">
        <span className="eyebrow">How It Works</span>
        <h2 className="mt-2 font-display text-3xl md:text-4xl text-primary">
          A Simple, Transparent Process
        </h2>
      </div>

      <div className="mt-14 relative">
        <div
          className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-border"
          aria-hidden
        />
        <div className="grid md:grid-cols-5 gap-8 md:gap-4">
          {steps.map((step) => (
            <div key={step.n} className="relative text-center md:text-left">
              <div className="mx-auto md:mx-0 relative z-10 h-16 w-16 rounded-full bg-background border-2 border-accent flex items-center justify-center font-mono text-accent-dark text-lg">
                {step.n}
              </div>
              <h3 className="mt-4 font-display text-base text-primary leading-snug">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
