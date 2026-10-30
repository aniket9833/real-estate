'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { loginAction, type LoginActionState } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';

const initialState: LoginActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
        </>
      ) : (
        'Sign In'
      )}
    </Button>
  );
}

function AdminLoginForm() {
  const [state, formAction] = React.useActionState(loginAction, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (state.success) {
      router.push(searchParams.get('next') || '/admin');
      router.refresh();
    }
  }, [state.success, router, searchParams]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-soft">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-accent-light font-display text-lg italic">
            A
          </span>
          <div>
            <div className="font-display text-lg text-primary leading-none">
              AVASYA
            </div>
            <div className="text-[0.65rem] font-mono tracking-wide uppercase text-muted mt-0.5">
              Owner Dashboard
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted mb-5">
          <Lock className="h-4 w-4" />
          <span className="text-sm">
            Sign in to manage properties & enquiries
          </span>
        </div>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-lg bg-status-sold/10 border border-status-sold/30 px-4 py-3 text-sm text-status-sold">
              {state.error}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-primary flex items-center justify-center px-4">
          <div
            role="status"
            className="flex items-center gap-2 rounded-2xl bg-surface p-8 text-muted shadow-soft"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading sign-in form...
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </React.Suspense>
  );
}
