'use client';

import * as React from 'react';
import { Project, ProjectCategory, ProjectMediaType } from '@/types/portfolio';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { resolveThumbnailUrl, extractGoogleDriveId } from '@/lib/media';
import { generateSlug } from '@/lib/slug';
import { Sparkles, HardDrive, AlertCircle } from 'lucide-react';

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectToEdit?: Project | null;
  onSuccess: (savedProject: Project) => void;
}

interface FormContentProps {
  projectToEdit?: Project | null;
  onClose: () => void;
  onSuccess: (savedProject: Project) => void;
}

function FormContent({ projectToEdit, onClose, onSuccess }: FormContentProps) {
  const isEditing = Boolean(projectToEdit);

  const [title, setTitle] = React.useState(projectToEdit?.title || '');
  const [slug, setSlug] = React.useState(projectToEdit?.slug || '');
  const [category, setCategory] = React.useState<ProjectCategory>(projectToEdit?.category || 'video');
  const [type, setType] = React.useState<ProjectMediaType>(projectToEdit?.type || 'video');
  const [description, setDescription] = React.useState(projectToEdit?.description || '');
  const [fullDescription, setFullDescription] = React.useState(projectToEdit?.fullDescription || '');
  const [client, setClient] = React.useState(projectToEdit?.client || '');
  const [year, setYear] = React.useState(projectToEdit?.year || new Date().getFullYear().toString());
  const [duration, setDuration] = React.useState(projectToEdit?.duration || '');
  const [toolsString, setToolsString] = React.useState(
    projectToEdit?.tools ? projectToEdit.tools.join(', ') : 'Premiere Pro, DaVinci Resolve'
  );
  const [tagsString, setTagsString] = React.useState(
    projectToEdit?.tags ? projectToEdit.tags.join(', ') : 'Cinematic, Color Grading'
  );
  const [thumbnail, setThumbnail] = React.useState(projectToEdit?.thumbnail || '');
  const [mediaUrl, setMediaUrl] = React.useState(projectToEdit?.mediaUrl || '');
  const [featured, setFeatured] = React.useState(Boolean(projectToEdit?.featured));
  const [order, setOrder] = React.useState(projectToEdit?.order || 1);

  const [saving, setSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Project title is required.');
      return;
    }
    if (!thumbnail.trim()) {
      setErrorMsg('Thumbnail URL is required.');
      return;
    }
    if (!mediaUrl.trim()) {
      setErrorMsg('Media URL is required.');
      return;
    }

    setSaving(true);

    try {
      const tools = toolsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const tags = tagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        slug: slug.trim() ? generateSlug(slug.trim()) : generateSlug(title.trim()),
        category,
        type,
        description: description.trim(),
        fullDescription: fullDescription.trim() || description.trim(),
        client: client.trim(),
        year: year.trim(),
        duration: duration.trim(),
        tools,
        tags,
        thumbnail: thumbnail.trim(),
        mediaUrl: mediaUrl.trim(),
        featured,
        order: Number(order) || 1,
      };

      const url = isEditing
        ? `/api/admin/projects/${projectToEdit!.id}`
        : '/api/admin/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to save project.');
      }

      onSuccess(json.project);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const isThumbnailDrive = Boolean(extractGoogleDriveId(thumbnail));
  const isMediaDrive = Boolean(extractGoogleDriveId(mediaUrl));
  const resolvedPreviewThumb = resolveThumbnailUrl(thumbnail);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Title & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Project Title *
          </label>
          <Input
            required
            placeholder="e.g. Cyberpunk Cinematic Reel"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            URL Slug *
          </label>
          <Input
            required
            placeholder="e.g. cyberpunk-cinematic-reel"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
      </div>

      {/* Category & Media Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Category *
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProjectCategory)}
          >
            <option value="video">Video Editing</option>
            <option value="image">Image Retouching</option>
            <option value="graphic">Graphic Design</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Media Type *
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
            value={type}
            onChange={(e) => setType(e.target.value as ProjectMediaType)}
          >
            <option value="video">Video (Player / Embed)</option>
            <option value="image">Image / Graphic Visual</option>
          </select>
        </div>
      </div>

      {/* Short Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Card Short Summary *
        </label>
        <Textarea
          required
          rows={2}
          placeholder="Brief summary displayed on project cards..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Full Case Study Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Full Case Study & Process Notes (Optional)
        </label>
        <Textarea
          rows={3}
          placeholder="Detailed workflow, color grading decisions, editing pacing, client outcomes..."
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
        />
      </div>

      {/* Thumbnail URL & Google Drive Media URL */}
      <div className="space-y-4 pt-2 border-t border-zinc-800/80">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Thumbnail URL * (Google Drive link or direct image)
            </label>
            {isThumbnailDrive && (
              <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> Drive link detected
              </span>
            )}
          </div>
          <Input
            required
            placeholder="https://drive.google.com/file/d/FILE_ID/view or https://..."
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
          {thumbnail && (
            <div className="mt-2 flex items-center gap-3 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="w-16 h-10 rounded overflow-hidden bg-black shrink-0">
                <img
                  src={resolvedPreviewThumb}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xs text-zinc-400">Live Thumbnail Preview</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Media URL * (Google Drive Video / Embed / Image / YouTube)
            </label>
            {isMediaDrive && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> Drive embed ready
              </span>
            )}
          </div>
          <Input
            required
            placeholder="https://drive.google.com/file/d/FILE_ID/view or video link"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </div>
      </div>

      {/* Specs: Client, Year, Duration, Order */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Client / Brand
          </label>
          <Input
            placeholder="e.g. Apex Media"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Year
          </label>
          <Input
            placeholder="2025"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Duration / Size
          </label>
          <Input
            placeholder="01:30 or 4K"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Sort Order
          </label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Tools & Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Tools Used (comma separated)
          </label>
          <Input
            placeholder="Premiere Pro, DaVinci Resolve, Photoshop"
            value={toolsString}
            onChange={(e) => setToolsString(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Tags (comma separated)
          </label>
          <Input
            placeholder="Cinematic, Color Grading, Reels"
            value={tagsString}
            onChange={(e) => setTagsString(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Checkbox */}
      <div className="pt-2">
        <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-900 transition-colors">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-amber-500 bg-zinc-950 border-zinc-700 focus:ring-amber-400"
          />
          <div className="text-xs">
            <span className="font-bold text-zinc-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Mark as Featured Project
            </span>
            <span className="text-zinc-400">
              Featured projects will be highlighted prominently on the homepage hero showcase.
            </span>
          </div>
        </label>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" variant="default" disabled={saving}>
          {saving ? 'Saving Project...' : isEditing ? 'Update Project' : 'Create Project'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  projectToEdit,
  onSuccess,
}: ProjectFormDialogProps) {
  const isEditing = Boolean(projectToEdit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? `Edit Project: ${projectToEdit?.title}` : 'Add New Portfolio Project'}
        </DialogTitle>
        <DialogDescription>
          Provide project metadata, category, tags, and Google Drive media link.
        </DialogDescription>
      </DialogHeader>

      {open && (
        <FormContent
          key={projectToEdit?.id || 'new-project'}
          projectToEdit={projectToEdit}
          onClose={() => onOpenChange(false)}
          onSuccess={onSuccess}
        />
      )}
    </Dialog>
  );
}
