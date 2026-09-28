import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { updateSocials, getPortfolioData } from '@/lib/portfolio';

export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getPortfolioData();
  return NextResponse.json({ socials: data.socials });
}

export async function PUT(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid socials payload.' }, { status: 400 });
    }

    const updatedSocials = await updateSocials(body);
    return NextResponse.json({ success: true, socials: updatedSocials });
  } catch (error) {
    console.error('Update socials error:', error);
    return NextResponse.json({ error: 'Failed to update socials.' }, { status: 500 });
  }
}
