import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/session';
import { listProperties } from '@/services/property.service';

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const result = await listProperties({
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      pageSize: 50,
      publishedOnly: false,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error('GET /api/admin/properties error:', err);
    return NextResponse.json(
      { error: 'Could not load properties.' },
      { status: 500 },
    );
  }
}
