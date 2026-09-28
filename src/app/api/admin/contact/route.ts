import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { updateContact, getPortfolioData } from '@/lib/portfolio';

export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getPortfolioData();
  return NextResponse.json({ contact: data.contact });
}

export async function PUT(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid contact payload.' }, { status: 400 });
    }

    const updatedContact = await updateContact(body);
    return NextResponse.json({ success: true, contact: updatedContact });
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json({ error: 'Failed to update contact.' }, { status: 500 });
  }
}
