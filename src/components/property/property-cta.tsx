'use client';

import { useState } from 'react';
import { MessageCircle, Phone, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildWhatsAppLink, buildPropertyEnquiryMessage } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { SiteVisitDialog } from '@/components/property/site-visit-dialog';

export function PropertyCTA({
  propertyId,
  title,
  areaLabel,
}: {
  propertyId: string;
  title: string;
  areaLabel: string;
}) {
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    buildPropertyEnquiryMessage(title, areaLabel),
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 shadow-card">
      <h3 className="font-display text-xl text-primary">
        Interested in this property?
      </h3>
      <p className="text-sm text-muted mt-1">
        We usually reply within a few hours during office hours.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <Button
          variant="whatsapp"
          size="lg"
          className="w-full bg-[#25D366] text-white hover:bg-[#20bd5a]"
          onClick={() =>
            window.open(whatsappHref, '_blank', 'noopener,noreferrer')
          }
        >
          <MessageCircle className="h-5 w-5" /> WhatsApp Us
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => {
            window.location.href = `tel:${siteConfig.phoneNumber}`;
          }}
        >
          <Phone className="h-5 w-5" /> Call Now
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => setVisitDialogOpen(true)}
        >
          <CalendarCheck className="h-5 w-5" /> Request Site Visit
        </Button>
      </div>

      <SiteVisitDialog
        open={visitDialogOpen}
        onOpenChange={setVisitDialogOpen}
        propertyId={propertyId}
        propertyTitle={title}
      />
    </div>
  );
}
