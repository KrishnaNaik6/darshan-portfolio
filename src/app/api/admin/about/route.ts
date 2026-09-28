import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { updateAbout, getPortfolioData } from '@/lib/portfolio';

export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getPortfolioData();
  return NextResponse.json({ about: data.about });
}

export async function PUT(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid about payload.' }, { status: 400 });
    }

    const updatedAbout = await updateAbout(body);
    return NextResponse.json({ success: true, about: updatedAbout });
  } catch (error) {
    console.error('Update about error:', error);
    return NextResponse.json({ error: 'Failed to update about section.' }, { status: 500 });
  }
}
