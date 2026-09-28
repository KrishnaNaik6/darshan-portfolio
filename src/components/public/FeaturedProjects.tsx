import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedProjectsProps {
  projects: Project[];
  limit?: number;
}

export function FeaturedProjects({ projects, limit = 6 }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured).slice(0, limit);
  const displayProjects = featured.length > 0 ? featured : projects.slice(0, limit);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Highlights
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase">
            Featured Projects
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            A selection of top-performing video reels, retouching projects, and key visuals.
          </p>
        </div>

        <Link href="/work" className="self-start md:self-auto">
          <Button variant="outline" className="gap-2 group">
            Explore All Work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
