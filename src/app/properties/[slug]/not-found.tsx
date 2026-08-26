import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PropertyNotFound() {
  return (
    <div className="container section-pad text-center">
      <h1 className="font-display text-3xl text-primary">Property Not Found</h1>
      <p className="mt-2 text-muted max-w-md mx-auto">
        This listing may have been sold, unpublished, or the link may be
        incorrect.
      </p>
      <Button asChild className="mt-6">
        <Link href="/properties">Browse Available Properties</Link>
      </Button>
    </div>
  );
}
