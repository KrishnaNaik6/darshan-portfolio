import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPortfolioData, getProjectBySlug } from '@/lib/portfolio';
import { MediaViewer } from '@/components/public/MediaViewer';
import { ProjectCard } from '@/components/public/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectJsonLd } from '@/components/public/JsonLd';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Wrench,
  Sparkles,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const categoryName =
    project.category === 'video'
      ? 'Video Editing'
      : project.category === 'image'
      ? 'Image Retouching'
      : 'Graphic Design';

  return {
    title: `${project.title} — ${categoryName} Case Study | Darshan G Poojari`,
    description: `${project.description} Edited and designed by Darshan G Poojari. Tools: ${(project.tools || []).join(', ')}.`,
    keywords: [
      project.title,
      categoryName,
      ...(project.tags || []),
      ...(project.tools || []),
      'Darshan G Poojari',
      'Darshan Poojari',
      'Darshan Video Editor',
      'Video Editing Case Study',
    ],
    alternates: {
      canonical: `/work/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | Darshan G Poojari`,
      description: project.description,
      type: project.type === 'video' ? 'video.other' : 'article',
      url: `/work/${project.slug}`,
      images: [
        {
          url: project.thumbnail,
          width: 1200,
          height: 630,
          alt: `${project.title} - ${categoryName} by Darshan G Poojari`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Darshan G Poojari`,
      description: project.description,
      images: [project.thumbnail],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPortfolioData();
  const project = data.projects.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  );

  if (!project) {
    notFound();
  }

  // Related projects in the same category
  const relatedProjects = data.projects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  // Next / Previous projects for seamless browsing
  const currentIndex = data.projects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? data.projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < data.projects.length - 1 ? data.projects[currentIndex + 1] : null;

  const categoryLabel =
    project.category === 'video'
      ? 'Video Editing'
      : project.category === 'image'
      ? 'Image Retouching'
      : 'Graphic Design';

  const categoryVariant =
    project.category === 'video'
      ? 'video'
      : project.category === 'image'
      ? 'image'
      : 'graphic';

  return (
    <>
      <ProjectJsonLd project={project} />
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Back Link */}
      <div>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all projects
        </Link>
      </div>

      {/* Project Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant={categoryVariant} className="text-xs uppercase px-3 py-1">
            {categoryLabel}
          </Badge>
          {project.featured && (
            <Badge variant="featured" className="gap-1 text-xs">
              <Sparkles className="w-3 h-3" />
              Featured Showcase
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-100 uppercase">
          {project.title}
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 font-light leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Main Showcase Player / Image Viewer */}
      <div className="py-2">
        <MediaViewer
          mediaUrl={project.mediaUrl}
          thumbnailUrl={project.thumbnail}
          title={project.title}
          type={project.type}
        />
      </div>

      {/* Metadata Info Bar & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
        {/* Left: Project Overview */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 uppercase tracking-tight">
              Project Overview & Process
            </h2>
            <div className="text-zinc-300 text-base leading-relaxed space-y-4 whitespace-pre-line font-light">
              {project.fullDescription || project.description}
            </div>
          </div>

          {/* Key Deliverables / Highlights */}
          {project.tags && project.tags.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Focus Areas & Techniques
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Meta Specs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 border-b border-zinc-800 pb-3">
              Project Information
            </h3>

            {project.client && (
              <div className="flex items-start gap-3 text-sm">
                <User className="w-4 h-4 text-zinc-500 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Client / Channel</div>
                  <div className="font-medium text-zinc-200">{project.client}</div>
                </div>
              </div>
            )}

            {project.year && (
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="w-4 h-4 text-zinc-500 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Timeline / Year</div>
                  <div className="font-medium text-zinc-200">{project.year}</div>
                </div>
              </div>
            )}

            {project.duration && (
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-zinc-500 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Format / Duration</div>
                  <div className="font-medium text-zinc-200">{project.duration}</div>
                </div>
              </div>
            )}

            {project.tools && project.tools.length > 0 && (
              <div className="flex items-start gap-3 text-sm">
                <Wrench className="w-4 h-4 text-zinc-500 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Software & Pipeline</div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Direct Work CTA */}
            <div className="pt-4 border-t border-zinc-800">
              <Link href="/contact" className="block w-full">
                <Button variant="default" className="w-full gap-2 text-sm font-bold">
                  Request Similar Project
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Next / Previous Project Navigation */}
      <div className="pt-12 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevProject ? (
          <Link
            href={`/work/${prevProject.slug}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition-all text-left"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-500" />
            <div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Previous</div>
              <div className="text-sm font-bold text-zinc-200">{prevProject.title}</div>
            </div>
          </Link>
        ) : <div />}

        {nextProject && (
          <Link
            href={`/work/${nextProject.slug}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition-all text-right"
          >
            <div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Next Project</div>
              <div className="text-sm font-bold text-zinc-200">{nextProject.title}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
          </Link>
        )}
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="pt-16 space-y-8 border-t border-zinc-900">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-zinc-100">
              More in {categoryLabel}
            </h3>
            <p className="text-sm text-zinc-400">
              Explore other selected projects in this category.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
