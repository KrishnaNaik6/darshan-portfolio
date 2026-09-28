import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { reorderProjects } from '@/lib/portfolio';

export async function POST(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { order } = body;

    if (!Array.isArray(order)) {
      return NextResponse.json({ error: 'Invalid order list.' }, { status: 400 });
    }

    const reordered = await reorderProjects(order);
    return NextResponse.json({ success: true, projects: reordered });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Failed to reorder projects.' }, { status: 500 });
  }
}
