import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/session';
import { getPropertyById, deleteProperty } from '@/services/property.service';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const property = await getPropertyById(params.id);
  if (!property)
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  return NextResponse.json(property);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await deleteProperty(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE property error:', err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Could not delete property.',
      },
      { status: 500 },
    );
  }
}
