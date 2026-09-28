import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { updateHero, getPortfolioData } from '@/lib/portfolio';

export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getPortfolioData();
  return NextResponse.json({ hero: data.hero });
}

export async function PUT(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid hero payload.' }, { status: 400 });
    }

    const updatedHero = await updateHero(body);
    return NextResponse.json({ success: true, hero: updatedHero });
  } catch (error) {
    console.error('Update hero error:', error);
    return NextResponse.json({ error: 'Failed to update hero.' }, { status: 500 });
  }
}
