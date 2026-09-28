import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { getPortfolioData } from '@/lib/portfolio';

export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await getPortfolioData();
    const totalProjects = data.projects.length;
    const featuredProjects = data.projects.filter(p => p.featured).length;
    const videoProjects = data.projects.filter(p => p.category === 'video').length;
    const imageProjects = data.projects.filter(p => p.category === 'image').length;
    const graphicProjects = data.projects.filter(p => p.category === 'graphic').length;
    const totalServices = data.services.length;

    return NextResponse.json({
      stats: {
        totalProjects,
        featuredProjects,
        videoProjects,
        imageProjects,
        graphicProjects,
        totalServices
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to compute stats.' }, { status: 500 });
  }
}
