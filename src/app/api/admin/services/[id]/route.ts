import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { updateService, deleteService } from '@/lib/portfolio';

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await props.params;

  try {
    const body = await request.json();
    const updated = await updateService(id, body);
    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update service.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await props.params;

  try {
    const deleted = await deleteService(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Service not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Failed to delete service.' }, { status: 500 });
  }
}
