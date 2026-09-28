import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { resolveThumbnailUrl } from '@/lib/media';
import { Play, ArrowUpRight, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const thumbUrl = resolveThumbnailUrl(project.thumbnail);
  const isVideo = project.type === 'video' || project.category === 'video';

  const categoryBadgeVariant =
    project.category === 'video'
      ? 'video'
      : project.category === 'image'
      ? 'image'
      : 'graphic';

  const categoryLabel =
    project.category === 'video'
      ? 'Video Editing'
      : project.category === 'image'
      ? 'Image Retouching'
      : 'Graphic Design';

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950/60 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
    >
      {/* Thumbnail Aspect Ratio Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
        {/* Project Thumbnail Image */}
        {/* Using standard img for resilience with arbitrary Google Drive and remote URLs */}
        <img
          src={thumbUrl}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Ambient Dark Gradient on Image Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Category & Featured Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge variant={categoryBadgeVariant} className="backdrop-blur-md">
            {categoryLabel}
          </Badge>
          {project.featured && (
            <Badge variant="featured" className="gap-1 backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              Featured
            </Badge>
          )}
        </div>

        {/* Video Play Indicator Overlay */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Card Info Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
        </div>

        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed font-light">
          {project.description}
        </p>

        {/* Tags list */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 text-zinc-500">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
