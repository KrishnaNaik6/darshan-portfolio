'use client';

import * as React from 'react';
import { Project } from '@/types/portfolio';
import { resolveThumbnailUrl } from '@/lib/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Search,
  Film,
  Image as ImageIcon,
  Palette,
  AlertTriangle,
  Layers
} from 'lucide-react';

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => void;
  onOpenCreate: () => void;
  onOpenEdit: (project: Project) => void;
}

export function ProjectsManager({
  projects,
  onRefresh,
  onOpenCreate,
  onOpenEdit,
}: ProjectsManagerProps) {
  const [filterCategory, setFilterCategory] = React.useState<string>('all');
  const [filterFeatured, setFilterFeatured] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState('');
  
  // Deletion Dialog State
  const [deletingProject, setDeletingProject] = React.useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Sorting & Reordering State
  const [isReordering, setIsReordering] = React.useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesFeat = !filterFeatured || p.featured;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesCat && matchesFeat && matchesSearch;
  });

  // Toggle Featured status
  const handleToggleFeatured = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
    }
  };

  // Delete project
  const confirmDelete = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deletingProject.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeletingProject(null);
        onRefresh();
      }
    } catch (err) {
      console.error('Delete project failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Move project up/down in order
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (isReordering) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    setIsReordering(true);
    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    const orderedIds = newProjects.map((p) => p.id);

    try {
      const res = await fetch('/api/admin/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderedIds }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Reorder failed:', err);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Portfolio Projects ({projects.length})
          </h2>
          <p className="text-xs text-zinc-400">
            Add, update, reorder, or toggle featured video and graphic showcases.
          </p>
        </div>

        <Button onClick={onOpenCreate} variant="accent" className="gap-2 text-xs sm:text-sm">
          <Plus className="w-4 h-4" />
          Add New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-950/70">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({projects.length})
          </button>
          <button
            onClick={() => setFilterCategory('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterCategory === 'video'
                ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-800/60'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Video ({projects.filter((p) => p.category === 'video').length})
          </button>
          <button
            onClick={() => setFilterCategory('image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterCategory === 'image'
                ? 'bg-amber-950/60 text-amber-300 font-bold border border-amber-800/60'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Image ({projects.filter((p) => p.category === 'image').length})
          </button>
          <button
            onClick={() => setFilterCategory('graphic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterCategory === 'graphic'
                ? 'bg-indigo-950/60 text-indigo-300 font-bold border border-indigo-800/60'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Graphic ({projects.filter((p) => p.category === 'graphic').length})
          </button>
          <button
            onClick={() => setFilterFeatured(!filterFeatured)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterFeatured
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Featured Only
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <Input
            placeholder="Filter by title or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs bg-zinc-900 border-zinc-800"
          />
        </div>
      </div>

      {/* Projects List / Table */}
      <div className="space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-zinc-800/60 bg-zinc-950/40 text-zinc-400 text-sm">
            No matching projects found.
          </div>
        ) : (
          filteredProjects.map((project, idx) => {
            const thumb = resolveThumbnailUrl(project.thumbnail);
            const isFirst = idx === 0;
            const isLast = idx === filteredProjects.length - 1;

            return (
              <div
                key={project.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900/40 hover:border-zinc-700 transition-colors"
              >
                {/* Left: Thumbnail & Project Meta */}
                <div className="flex items-start sm:items-center gap-4">
                  {/* Reorder Buttons (Only when no filter active) */}
                  {filterCategory === 'all' && !filterFeatured && !search && (
                    <div className="flex flex-col gap-1 shrink-0 text-zinc-500">
                      <button
                        onClick={() => handleMoveOrder(idx, 'up')}
                        disabled={isFirst || isReordering}
                        className="p-1 rounded hover:bg-zinc-800 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(idx, 'down')}
                        disabled={isLast || isReordering}
                        className="p-1 rounded hover:bg-zinc-800 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Thumbnail Image */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 relative">
                    <img
                      src={thumb}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm text-zinc-100">{project.title}</h3>
                      <Badge
                        variant={
                          project.category === 'video'
                            ? 'video'
                            : project.category === 'image'
                            ? 'image'
                            : 'graphic'
                        }
                        className="text-[10px] uppercase py-0"
                      >
                        {project.category}
                      </Badge>
                      {project.featured && (
                        <Badge variant="featured" className="text-[10px] py-0 gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Featured
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1 max-w-md">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                      <span>/{project.slug}</span>
                      {project.year && <span>• {project.year}</span>}
                      {project.client && <span>• {project.client}</span>}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFeatured(project)}
                    className={`text-xs gap-1 h-8 ${
                      project.featured
                        ? 'border-amber-500/40 text-amber-300 hover:bg-amber-950/40'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                    title="Toggle featured status on homepage"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {project.featured ? 'Featured' : 'Feature'}
                  </Button>

                  <a
                    href={`/work/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="View live case study page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenEdit(project)}
                    className="text-xs gap-1 h-8"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeletingProject(project)}
                    className="text-xs gap-1 h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingProject)}
        onOpenChange={(open) => !open && setDeletingProject(null)}
      >
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            Confirm Project Deletion
          </div>
          <DialogTitle className="text-zinc-200 text-sm">
            Are you sure you want to delete &quot;{deletingProject?.title}&quot;?
          </DialogTitle>
          <DialogDescription>
            This will permanently remove the project from portfolio.json. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeletingProject(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Permanently Delete'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
