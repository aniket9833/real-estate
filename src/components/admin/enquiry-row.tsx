'use client';

import { useTransition } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { updateEnquiryStatusAction } from '@/actions/enquiry.actions';
import { buildWhatsAppLink } from '@/lib/utils';

const STATUS_OPTIONS = [
  'new',
  'contacted',
  'site-visit-scheduled',
  'closed',
  'not-interested',
];

type Enquiry = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  propertyTitleSnapshot?: string;
  message?: string;
  source: string;
  status: string;
};

export function EnquiryRow({ enquiry }: { enquiry: Enquiry }) {
  const [isPending, startTransition] = useTransition();
  const waMessage = `Hi ${enquiry.name}, thank you for your enquiry${
    enquiry.propertyTitleSnapshot
      ? ` about "${enquiry.propertyTitleSnapshot}"`
      : ''
  } with AVASYA Consultants. `;

  return (
    <tr className="border-t border-border align-top">
      <td className="px-4 py-3">
        <div className="font-medium text-ink">{enquiry.name}</div>
        <div className="text-xs text-muted mt-0.5">{enquiry.phone}</div>
        {enquiry.email && (
          <div className="text-xs text-muted">{enquiry.email}</div>
        )}
      </td>
      <td className="px-4 py-3 hidden md:table-cell max-w-[220px]">
        <div className="text-ink/80 text-xs">
          {enquiry.propertyTitleSnapshot || 'General enquiry'}
        </div>
        {enquiry.message && (
          <div className="text-xs text-muted mt-1 line-clamp-2">
            {enquiry.message}
          </div>
        )}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted capitalize">
        {enquiry.source.replace(/-/g, ' ')}
      </td>
      <td className="px-4 py-3">
        <select
          defaultValue={enquiry.status}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() =>
              updateEnquiryStatusAction(enquiry._id, e.target.value),
            )
          }
          className="text-xs rounded-lg border border-border bg-background px-2 py-1.5"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/-/g, ' ')}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1.5">
          <a
            href={`tel:${enquiry.phone}`}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-primary/5"
            aria-label={`Call ${enquiry.name}`}
          >
            <Phone className="h-3.5 w-3.5" />
          </a>
          <a
            href={buildWhatsAppLink(
              enquiry.phone.replace(/[^0-9]/g, ''),
              waMessage,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-[#25D366] hover:bg-[#25D366]/5"
            aria-label={`WhatsApp ${enquiry.name}`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </a>
        </div>
      </td>
    </tr>
  );
}
