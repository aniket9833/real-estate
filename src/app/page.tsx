import { listProperties } from '@/services/property.service';
import { Hero } from '@/components/home/hero';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { ProcessSection } from '@/components/home/process-section';
import { CtaBand } from '@/components/home/cta-band';

// Force dynamic rendering rather than requiring a DB connection at build
// time, and so admin edits (publish/unpublish, price changes) show up
// without a full redeploy.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { items } = await listProperties({
    featuredOnly: true,
    pageSize: 6,
    publishedOnly: true,
  });

  return (
    <>
      <Hero />
      <FeaturedProperties properties={items} />
      <WhyChooseUs />
      <ProcessSection />
      <CtaBand />
    </>
  );
}
