import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/session';
import { listEnquiries } from '@/services/enquiry.service';

/** Admin-only: list enquiries with optional status filter. Public submission goes through the submitEnquiryAction server action, not this route. */
export async function GET(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const result = await listEnquiries({
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error('GET /api/enquiries error:', err);
    return NextResponse.json(
      { error: 'Could not load enquiries.' },
      { status: 500 },
    );
  }
}
