import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);

  if (!session || !session.authenticated) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      expiresAt: session.expiresAt
    }
  });
}
