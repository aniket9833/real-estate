import { PropertyForm } from '@/components/admin/property-form';

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-primary mb-1">Add Property</h1>
      <p className="text-sm text-muted mb-6">
        Fill in the details below. You can save it as a draft and publish later.
      </p>
      <PropertyForm />
    </div>
  );
}
