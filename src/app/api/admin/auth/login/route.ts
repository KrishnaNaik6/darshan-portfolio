import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createSessionToken, setAdminCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const isValid = validateCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your username and password.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(username);
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: { username }
    });

    setAdminCookie(response, token);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
