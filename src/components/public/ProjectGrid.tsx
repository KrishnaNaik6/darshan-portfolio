'use client';

import * as React from 'react';
import { Project, ProjectCategory } from '@/types/portfolio';
import { ProjectCard } from './ProjectCard';
import { Film, Image as ImageIcon, Palette, LayoutGrid, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface ProjectGridProps {
  projects: Project[];
  initialCategory?: string;
  showSearch?: boolean;
}

type FilterCategory = 'all' | ProjectCategory;

export function ProjectGrid({
  projects,
  initialCategory = 'all',
  showSearch = true,
}: ProjectGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<FilterCategory>(
    (initialCategory as FilterCategory) || 'all'
  );
  const [searchQuery, setSearchQuery] = React.useState('');

  const filterTabs: { id: FilterCategory; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: 'all',
      label: 'All Work',
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
      count: projects.length,
    },
    {
      id: 'video',
      label: 'Video Editing',
      icon: <Film className="w-3.5 h-3.5" />,
      count: projects.filter((p) => p.category === 'video').length,
    },
    {
      id: 'image',
      label: 'Image Retouching',
      icon: <ImageIcon className="w-3.5 h-3.5" />,
      count: projects.filter((p) => p.category === 'image').length,
    },
    {
      id: 'graphic',
      label: 'Graphic Design',
      icon: <Palette className="w-3.5 h-3.5" />,
      count: projects.filter((p) => p.category === 'graphic').length,
    },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'all' || project.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      (project.tags && project.tags.some((t) => t.toLowerCase().includes(query))) ||
      (project.tools && project.tools.some((t) => t.toLowerCase().includes(query)));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Category Filter Controls & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 max-w-full overflow-x-auto">
          {filterTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'bg-zinc-100 text-zinc-950 font-bold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-mono',
                    isActive ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-800 text-zinc-400'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input if enabled */}
        {showSearch && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search work, tags, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 bg-zinc-900/50 border-zinc-800 text-xs rounded-xl focus-visible:ring-zinc-400"
            />
          </div>
        )}
      </div>

      {/* Grid of cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in duration-300">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-8 space-y-3">
          <p className="text-lg font-medium text-zinc-300">No projects found</p>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search filter or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-amber-400 hover:underline pt-2 inline-block"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
