import { NextRequest, NextResponse } from 'next/server';
import { listProperties } from '@/services/property.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await listProperties({
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice')
        ? Number(searchParams.get('minPrice'))
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? Number(searchParams.get('maxPrice'))
        : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      publishedOnly: true,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error('GET /api/properties error:', err);
    return NextResponse.json(
      { error: 'Could not load properties right now.' },
      { status: 500 },
    );
  }
}
