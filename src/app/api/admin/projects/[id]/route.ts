import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { updateProject, deleteProject, getProjectById } from '@/lib/portfolio';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await props.params;
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await props.params;

  try {
    const body = await request.json();
    const updated = await updateProject(id, body);
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update project.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await props.params;

  try {
    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
  }
}
