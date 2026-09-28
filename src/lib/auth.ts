import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_SECRET = process.env.AUTH_SECRET || 'darshan-portfolio-secure-auth-secret-key-2026-editor';
export const ADMIN_COOKIE_NAME = 'darshan_admin_token';
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Default credentials for dev/demo if not explicitly set in .env
const DEFAULT_ADMIN_USERNAME = 'darshan_admin';
const DEFAULT_ADMIN_PASSWORD = 'darshan@editor2026';

export interface AdminSession {
  username: string;
  authenticated: boolean;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Validates admin credentials against environment variables with timing-safe comparison
 */
export function validateCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;

  const expectedUser = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  try {
    const userBuffer = Buffer.from(username);
    const expectedUserBuffer = Buffer.from(expectedUser);
    const passBuffer = Buffer.from(password);
    const expectedPassBuffer = Buffer.from(expectedPass);

    if (userBuffer.length !== expectedUserBuffer.length || passBuffer.length !== expectedPassBuffer.length) {
      return false;
    }

    const isUserMatch = timingSafeEqual(userBuffer, expectedUserBuffer);
    const isPassMatch = timingSafeEqual(passBuffer, expectedPassBuffer);

    return isUserMatch && isPassMatch;
  } catch {
    return false;
  }
}

/**
 * Creates a cryptographically signed HMAC token for the admin session
 */
export function createSessionToken(username: string): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + TOKEN_MAX_AGE_SECONDS;
  const payload = Buffer.from(JSON.stringify({ u: username, i: now, e: exp })).toString('base64url');

  const hmac = createHmac('sha256', AUTH_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('base64url');

  return `${payload}.${signature}`;
}

/**
 * Verifies and decodes an HMAC token
 */
export function verifySessionToken(token: string | undefined | null): AdminSession | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;

  try {
    const expectedHmac = createHmac('sha256', AUTH_SECRET);
    expectedHmac.update(payloadBase64);
    const expectedSignature = expectedHmac.digest('base64url');

    const sigBuffer = Buffer.from(signature);
    const expectedSigBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedSigBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expectedSigBuffer)) return null;

    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const parsed = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (!parsed.e || parsed.e < now) {
      return null; // Expired
    }

    return {
      username: parsed.u || 'admin',
      authenticated: true,
      issuedAt: parsed.i,
      expiresAt: parsed.e
    };
  } catch {
    return null;
  }
}

/**
 * Helper to check current session from server components / server actions
 */
export async function getServerAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Helper to check session from Route Handlers (NextRequest)
 */
export function getRequestAdminSession(request: NextRequest): AdminSession | null {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/**
 * Attaches auth session cookie to NextResponse
 */
export function setAdminCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_MAX_AGE_SECONDS
  });
}

/**
 * Clears auth session cookie from NextResponse
 */
export function clearAdminCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}
