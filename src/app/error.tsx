'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container section-pad text-center min-h-[50vh] flex flex-col items-center justify-center">
      <h1 className="font-display text-3xl text-primary">
        Something went wrong
      </h1>
      <p className="mt-2 text-muted max-w-md">
        We couldn&apos;t load this page. Please try again, or reach us directly
        on WhatsApp if the problem continues.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
