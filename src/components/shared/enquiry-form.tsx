'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import {
  submitEnquiryAction,
  type EnquiryFormState,
} from '@/actions/enquiry.actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const initialState: EnquiryFormState = {};

interface EnquiryFormProps {
  source: 'contact-form' | 'property-enquiry' | 'site-visit-request';
  propertyId?: string;
  propertyTitle?: string;
  showVisitDate?: boolean;
  onSuccess?: () => void;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Sending…
        </>
      ) : (
        label
      )}
    </Button>
  );
}

export function EnquiryForm({
  source,
  propertyId,
  propertyTitle,
  showVisitDate,
  onSuccess,
}: EnquiryFormProps) {
  const [state, formAction] = React.useActionState(
    submitEnquiryAction,
    initialState,
  );

  if (state.success) {
    if (onSuccess) onSuccess();
    return (
      <div className="rounded-xl bg-status-available/10 border border-status-available/30 p-5 text-center">
        <CheckCircle2 className="h-8 w-8 text-status-available mx-auto mb-2" />
        <p className="font-display text-lg text-primary">
          Thank you — your enquiry is in.
        </p>
        <p className="text-sm text-muted mt-1">
          We&apos;ll reach out to you shortly. For a faster response, you can
          also message us directly on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="source" value={source} />
      {propertyId && (
        <input type="hidden" name="propertyId" value={propertyId} />
      )}

      {state.error && (
        <div className="rounded-lg bg-status-sold/10 border border-status-sold/30 px-4 py-3 text-sm text-status-sold">
          {state.error}
        </div>
      )}

      {propertyTitle && (
        <p className="text-sm text-muted">
          Regarding:{' '}
          <span className="text-ink font-medium">{propertyTitle}</span>
        </p>
      )}

      <Field
        label="Your Name"
        name="name"
        required
        error={state.fieldErrors?.name}
      >
        <input
          id="name"
          name="name"
          required
          className={inputClass(!!state.fieldErrors?.name)}
          placeholder="e.g. Rahul Deshmukh"
        />
      </Field>

      <Field
        label="Phone Number"
        name="phone"
        required
        error={state.fieldErrors?.phone}
      >
        <input
          id="phone"
          name="phone"
          required
          inputMode="tel"
          className={inputClass(!!state.fieldErrors?.phone)}
          placeholder="e.g. 98765 43210"
        />
      </Field>

      <Field
        label="Email (optional)"
        name="email"
        error={state.fieldErrors?.email}
      >
        <input
          id="email"
          name="email"
          type="email"
          className={inputClass(!!state.fieldErrors?.email)}
          placeholder="you@example.com"
        />
      </Field>

      {showVisitDate && (
        <Field label="Preferred Visit Date" name="preferredVisitDate">
          <input
            id="preferredVisitDate"
            name="preferredVisitDate"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            className={inputClass(false)}
          />
        </Field>
      )}

      <Field
        label="Message (optional)"
        name="message"
        error={state.fieldErrors?.message}
      >
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass(!!state.fieldErrors?.message)}
          placeholder="Tell us what you're looking for…"
        />
      </Field>

      <SubmitButton
        label={showVisitDate ? 'Request Site Visit' : 'Send Enquiry'}
      />
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/50',
    hasError ? 'border-status-sold' : 'border-border',
  );
}

function Field({
  label,
  name,
  required,
  error,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-ink mb-1.5"
      >
        {label} {required && <span className="text-status-sold">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-status-sold">{error}</p>}
    </div>
  );
}
