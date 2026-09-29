import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/portfolio';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get public portfolio data:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio data.' }, { status: 500 });
  }
}
