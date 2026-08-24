import { Inbox } from 'lucide-react';
import { listEnquiries } from '@/services/enquiry.service';
import { EnquiryRow } from '@/components/admin/enquiry-row';

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const { items, total } = await listEnquiries({
    status: searchParams.status,
    pageSize: 100,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-primary">Enquiries</h1>
        <p className="text-sm text-muted mt-1">{total} total enquiries</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: 'All', value: undefined },
          { label: 'New', value: 'new' },
          { label: 'Contacted', value: 'contacted' },
          { label: 'Site Visit Scheduled', value: 'site-visit-scheduled' },
          { label: 'Closed', value: 'closed' },
          { label: 'Not Interested', value: 'not-interested' },
        ].map((f) => (
          <a
            key={f.label}
            href={f.value ? `?status=${f.value}` : '?'}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              searchParams.status === f.value ||
              (!searchParams.status && !f.value)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-surface text-ink/70 border-border'
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <Inbox
            className="h-10 w-10 text-muted mx-auto mb-3"
            strokeWidth={1.5}
          />
          <p className="font-display text-lg text-primary">
            No enquiries here yet
          </p>
          <p className="text-sm text-muted mt-1">
            New enquiries from your website will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary/5 text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">
                    Regarding
                  </th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    Source
                  </th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <EnquiryRow
                    key={e._id.toString()}
                    enquiry={{ ...e, _id: e._id.toString() }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
