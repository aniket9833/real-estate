import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/session';
import { getPropertyById, deleteProperty } from '@/services/property.service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property)
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  return NextResponse.json(property);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await deleteProperty(id);
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
