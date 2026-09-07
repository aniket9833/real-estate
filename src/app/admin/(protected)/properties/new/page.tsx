import { PropertyForm } from '@/components/admin/property-form';

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-primary mb-1">Add Property</h1>
      <p className="text-sm text-muted mb-6">
        Add the essentials and publish when you&apos;re ready.
      </p>
      <PropertyForm />
    </div>
  );
}
