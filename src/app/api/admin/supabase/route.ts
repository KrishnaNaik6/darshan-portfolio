import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { getPortfolioData, savePortfolioData } from '@/lib/portfolio';

export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const configured = isSupabaseConfigured();
  if (!configured) {
    return NextResponse.json({
      configured: false,
      message: 'Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY/SERVICE_ROLE_KEY) are not set.',
    });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      configured: false,
      message: 'Could not initialize Supabase client.',
    });
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_data')
      .select('id, updated_at')
      .eq('id', 'main')
      .maybeSingle();

    if (error) {
      return NextResponse.json({
        configured: true,
        connected: false,
        error: error.message,
        tableExists: false,
        message: 'Connected to Supabase, but portfolio_data table was not found. Please run the SQL migration in supabase/schema.sql.',
      });
    }

    return NextResponse.json({
      configured: true,
      connected: true,
      tableExists: true,
      recordFound: Boolean(data),
      updatedAt: data?.updated_at || null,
      message: 'Supabase is fully connected and ready for permanent data persistence!',
    });
  } catch (err) {
    return NextResponse.json({
      configured: true,
      connected: false,
      error: err instanceof Error ? err.message : 'Connection test failed.',
    });
  }
}

export async function POST(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase environment variables are missing.' },
      { status: 400 }
    );
  }

  try {
    const currentData = await getPortfolioData();
    await savePortfolioData(currentData);
    return NextResponse.json({
      success: true,
      message: 'Successfully synced all local portfolio content to Supabase database!',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to sync to Supabase.' },
      { status: 500 }
    );
  }
}
