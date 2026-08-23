'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { EnquiryForm } from '@/components/shared/enquiry-form';

export function SiteVisitDialog({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyTitle: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-primary/50 backdrop-blur-sm data-[state=open]:animate-fade-up" />
        <Dialog.Content className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-surface p-6 shadow-soft">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Dialog.Title className="font-display text-xl text-primary">
                Request a Site Visit
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted mt-1">
                Share your details and preferred date — we&apos;ll confirm a
                time with you.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="p-1 text-muted hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <EnquiryForm
            source="site-visit-request"
            propertyId={propertyId}
            propertyTitle={propertyTitle}
            showVisitDate
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
