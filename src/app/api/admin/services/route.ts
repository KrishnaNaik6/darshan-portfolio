import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { getPortfolioData, createService } from '@/lib/portfolio';

export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getPortfolioData();
  return NextResponse.json({ services: data.services });
}

export async function POST(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Service title is required.' }, { status: 400 });
    }
    if (!body.shortDescription || typeof body.shortDescription !== 'string') {
      return NextResponse.json({ error: 'Service description is required.' }, { status: 400 });
    }

    const created = await createService(body);
    return NextResponse.json({ success: true, service: created }, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 });
  }
}
