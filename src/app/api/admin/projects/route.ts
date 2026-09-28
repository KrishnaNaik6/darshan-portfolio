import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { getPortfolioData, createProject } from '@/lib/portfolio';

export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getPortfolioData();
  const sorted = [...data.projects].sort((a, b) => (a.order || 0) - (b.order || 0));
  return NextResponse.json({ projects: sorted });
}

export async function POST(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validation
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Project title is required.' }, { status: 400 });
    }
    if (!body.category || !['video', 'image', 'graphic'].includes(body.category)) {
      return NextResponse.json({ error: 'Valid category (video, image, or graphic) is required.' }, { status: 400 });
    }
    if (!body.type || !['video', 'image'].includes(body.type)) {
      return NextResponse.json({ error: 'Valid media type (video or image) is required.' }, { status: 400 });
    }
    if (!body.thumbnail || typeof body.thumbnail !== 'string') {
      return NextResponse.json({ error: 'Project thumbnail URL is required.' }, { status: 400 });
    }
    if (!body.mediaUrl || typeof body.mediaUrl !== 'string') {
      return NextResponse.json({ error: 'Project media URL is required.' }, { status: 400 });
    }

    const created = await createProject(body);
    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project.' }, { status: 500 });
  }
}
