import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container section-pad text-center min-h-[50vh] flex flex-col items-center justify-center">
      <h1 className="font-display text-4xl text-primary">404</h1>
      <p className="mt-2 text-muted">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
