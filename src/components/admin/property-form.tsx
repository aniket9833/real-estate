'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  createPropertyAction,
  updatePropertyAction,
  type PropertyFormState,
} from '@/actions/property.actions';
import {
  ImageUploader,
  type PendingImage,
} from '@/components/admin/image-uploader';
import { PROPERTY_TYPE_LABELS } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExistingProperty {
  _id: string;
  title: string;
  type: string;
  status: string;
  description: string;
  location: {
    area: string;
    city: string;
    district: string;
    state: string;
    landmark?: string;
    mapLink?: string;
  };
  areaValue: number;
  areaUnit: string;
  price: number;
  priceLabel?: string;
  features: string[];
  documentation: { verified: boolean; titleType?: string; notes?: string };
  isFeatured: boolean;
  isPublished: boolean;
}

const initialState: PropertyFormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Saving…
        </>
      ) : (
        label
      )}
    </Button>
  );
}

export function PropertyForm({ existing }: { existing?: ExistingProperty }) {
  const router = useRouter();
  const boundAction = existing
    ? updatePropertyAction.bind(null, existing._id)
    : createPropertyAction;
  const [state, formAction] = useFormState(boundAction, initialState);
  const [images, setImages] = useState<PendingImage[]>([]);

  useEffect(() => {
    if (state.success) {
      router.push('/admin/properties');
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-8 max-w-3xl">
      {state.error && (
        <div className="rounded-lg bg-status-sold/10 border border-status-sold/30 px-4 py-3 text-sm text-status-sold">
          {state.error}
        </div>
      )}

      <Section title="Basic Details">
        <Field label="Title" name="title" error={state.fieldErrors?.title}>
          <input
            name="title"
            defaultValue={existing?.title}
            required
            className={inputClass(!!state.fieldErrors?.title)}
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Property Type"
            name="type"
            error={state.fieldErrors?.type}
          >
            <select
              name="type"
              defaultValue={existing?.type ?? 'residential-plot'}
              className={inputClass(false)}
            >
              {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status" name="status">
            <select
              name="status"
              defaultValue={existing?.status ?? 'available'}
              className={inputClass(false)}
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </Field>
        </div>

        <Field
          label="Description"
          name="description"
          error={state.fieldErrors?.description}
        >
          <textarea
            name="description"
            defaultValue={existing?.description}
            rows={5}
            required
            className={inputClass(!!state.fieldErrors?.description)}
          />
        </Field>
      </Section>

      <Section title="Location">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Area / Locality"
            name="area"
            error={state.fieldErrors?.['location.area']}
          >
            <input
              name="area"
              defaultValue={existing?.location.area}
              required
              placeholder="e.g. Malkapur"
              className={inputClass(!!state.fieldErrors?.['location.area'])}
            />
          </Field>
          <Field label="Landmark (optional)" name="landmark">
            <input
              name="landmark"
              defaultValue={existing?.location.landmark}
              className={inputClass(false)}
            />
          </Field>
          <Field label="City" name="city">
            <input
              name="city"
              defaultValue={existing?.location.city ?? 'Akola'}
              className={inputClass(false)}
            />
          </Field>
          <Field label="District" name="district">
            <input
              name="district"
              defaultValue={existing?.location.district ?? 'Akola'}
              className={inputClass(false)}
            />
          </Field>
        </div>
        <Field label="Google Maps Link (optional)" name="mapLink">
          <input
            name="mapLink"
            defaultValue={existing?.location.mapLink}
            placeholder="https://maps.google.com/…"
            className={inputClass(false)}
          />
        </Field>
      </Section>

      <Section title="Size & Price">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field
            label="Area Value"
            name="areaValue"
            error={state.fieldErrors?.areaValue}
          >
            <input
              name="areaValue"
              type="number"
              step="any"
              defaultValue={existing?.areaValue}
              required
              className={inputClass(!!state.fieldErrors?.areaValue)}
            />
          </Field>
          <Field label="Area Unit" name="areaUnit">
            <select
              name="areaUnit"
              defaultValue={existing?.areaUnit ?? 'sqft'}
              className={inputClass(false)}
            >
              <option value="sqft">Sq. Ft.</option>
              <option value="acre">Acre</option>
              <option value="gunta">Gunta</option>
              <option value="hectare">Hectare</option>
            </select>
          </Field>
          <Field
            label="Price (₹)"
            name="price"
            error={state.fieldErrors?.price}
          >
            <input
              name="price"
              type="number"
              step="any"
              defaultValue={existing?.price}
              required
              className={inputClass(!!state.fieldErrors?.price)}
            />
          </Field>
        </div>
        <Field label="Price Label Override (optional)" name="priceLabel">
          <input
            name="priceLabel"
            defaultValue={existing?.priceLabel}
            placeholder='e.g. "On Request"'
            className={inputClass(false)}
          />
        </Field>
        <Field label="Features (comma-separated)" name="features">
          <input
            name="features"
            defaultValue={existing?.features?.join(', ')}
            placeholder="Corner Plot, Road Facing, Gated Layout"
            className={inputClass(false)}
          />
        </Field>
      </Section>

      <Section title="Documentation">
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            name="verified"
            defaultChecked={existing?.documentation.verified}
            className="h-4 w-4 rounded accent-accent"
          />
          Mark as verified property
        </label>
        <Field label="Title Type (optional)" name="titleType">
          <input
            name="titleType"
            defaultValue={existing?.documentation.titleType}
            placeholder="e.g. 7/12 Extract Clear"
            className={inputClass(false)}
          />
        </Field>
        <Field label="Documentation Notes (optional)" name="docNotes">
          <textarea
            name="docNotes"
            defaultValue={existing?.documentation.notes}
            rows={3}
            className={inputClass(false)}
          />
        </Field>
      </Section>

      <Section title="Visibility">
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={existing?.isPublished ?? false}
              className="h-4 w-4 rounded accent-accent"
            />
            Published (visible on the public website)
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={existing?.isFeatured ?? false}
              className="h-4 w-4 rounded accent-accent"
            />
            Featured on homepage
          </label>
        </div>
      </Section>

      <Section title={existing ? 'Add More Photos' : 'Photos'}>
        <ImageUploader
          name={existing ? 'newImages' : 'images'}
          images={images}
          onChange={setImages}
        />
      </Section>

      <div className="flex gap-3 sticky bottom-4">
        <SubmitButton label={existing ? 'Save Changes' : 'Create Property'} />
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push('/admin/properties')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50',
    hasError ? 'border-status-sold' : 'border-border',
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-ink mb-1.5"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-status-sold">{error}</p>}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 space-y-4">
      <h2 className="font-display text-lg text-primary">{title}</h2>
      {children}
    </div>
  );
}
