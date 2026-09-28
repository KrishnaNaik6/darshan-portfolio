'use client';

import * as React from 'react';
import { Service, ProjectCategory } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface ServicesManagerProps {
  services: Service[];
  onRefresh: () => void;
}

export function ServicesManager({ services, onRefresh }: ServicesManagerProps) {
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [deletingService, setDeletingService] = React.useState<Service | null>(null);

  // Form State
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<ProjectCategory>('video');
  const [shortDescription, setShortDescription] = React.useState('');
  const [featuresString, setFeaturesString] = React.useState('');
  const [iconName, setIconName] = React.useState('Film');
  const [saving, setSaving] = React.useState(false);

  const openEdit = (s: Service) => {
    setEditingService(s);
    setTitle(s.title);
    setCategory(s.category);
    setShortDescription(s.shortDescription);
    setFeaturesString((s.features || []).join('\n'));
    setIconName(s.iconName || 'Film');
  };

  const openCreate = () => {
    setIsCreating(true);
    setEditingService(null);
    setTitle('');
    setCategory('video');
    setShortDescription('');
    setFeaturesString('High Quality Deliverables\nColor Grading & Sound\nFast Turnaround');
    setIconName('Film');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const features = featuresString
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        category,
        shortDescription: shortDescription.trim(),
        features,
        iconName,
        order: editingService ? editingService.order : services.length + 1,
      };

      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEditingService(null);
        setIsCreating(false);
        onRefresh();
      }
    } catch (err) {
      console.error('Save service failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    try {
      const res = await fetch(`/api/admin/services/${deletingService.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeletingService(null);
        onRefresh();
      }
    } catch (err) {
      console.error('Delete service error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Service Offerings ({services.length})
          </h2>
          <p className="text-xs text-zinc-400">
            Define your core services, descriptions, and feature bullet points.
          </p>
        </div>

        <Button onClick={openCreate} variant="accent" className="gap-2 text-xs sm:text-sm">
          <Plus className="w-4 h-4" />
          Add New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-zinc-500">{service.category}</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(service)}
                    className="h-7 w-7 p-0"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletingService(service)}
                    className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <h3 className="font-bold text-lg text-zinc-100">{service.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                {service.shortDescription}
              </p>

              {service.features && service.features.length > 0 && (
                <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Service Dialog */}
      <Dialog
        open={isCreating || Boolean(editingService)}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setEditingService(null);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service Offering'}
          </DialogTitle>
          <DialogDescription>
            Update the title, category, overview, and list of features.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Service Title *
            </label>
            <Input
              required
              placeholder="e.g. Cinematic Video Editing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Category *
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              >
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="graphic">Graphic</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Icon Type
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
              >
                <option value="Film">Film Reel (Video)</option>
                <option value="Image">Photo Frame (Image)</option>
                <option value="Palette">Color Palette (Graphic)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Short Description *
            </label>
            <Textarea
              required
              rows={2}
              placeholder="Brief description of the service and target deliverables..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Features (One per line)
            </label>
            <Textarea
              rows={4}
              placeholder="Pacing & Story Flow&#10;Color Grading & LUT Styling&#10;Sound Design"
              value={featuresString}
              onChange={(e) => setFeaturesString(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setEditingService(null);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={saving}>
              {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Service Confirmation */}
      <Dialog
        open={Boolean(deletingService)}
        onOpenChange={(open) => !open && setDeletingService(null)}
      >
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            Delete Service
          </div>
          <DialogTitle className="text-zinc-200 text-sm">
            Are you sure you want to delete &quot;{deletingService?.title}&quot;?
          </DialogTitle>
          <DialogDescription>
            This service card will be removed from your public website.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDeletingService(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Service
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
