'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { isGoogleDriveUrl, getDriveThumbnailUrl } from '@/lib/media';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HardDrive,
  Eye,
  X,
  Sparkles,
  Link as LinkIcon,
  RotateCcw,
  Check,
} from 'lucide-react';

interface UserPhotoManagerProps {
  currentPhoto: string;
  name?: string;
  onPhotoChange: (newPhotoUrl: string) => void;
  onRefresh?: () => void;
}

const DEFAULT_DARSHAN_PHOTO =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

export function UserPhotoManager({
  currentPhoto,
  name = 'Darshan G Poojari',
  onPhotoChange,
  onRefresh,
}: UserPhotoManagerProps) {
  const [photoUrl, setPhotoUrl] = React.useState(currentPhoto || '');
  const [prevPhoto, setPrevPhoto] = React.useState(currentPhoto);
  const [inputUrl, setInputUrl] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const [showLightbox, setShowLightbox] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state during render when prop changes
  if (currentPhoto !== prevPhoto) {
    setPrevPhoto(currentPhoto);
    setPhotoUrl(currentPhoto || '');
  }

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  /**
   * Client-side optimization: resizes huge images to max 1200x1200px before uploading
   */
  const optimizeImageFile = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      // If SVG or small gif, return as-is
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        return resolve(file);
      }

      const img = document.createElement('img');
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            'image/webp',
            0.9
          );
        } else {
          resolve(file);
        }
      };

      img.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  /**
   * Direct file upload handler
   */
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('error', 'Please select a valid image file (PNG, JPG, WebP, GIF, SVG).');
      return;
    }

    setIsUploading(true);
    try {
      const optimizedBlob = await optimizeImageFile(file);
      const formData = new FormData();
      formData.append(
        'file',
        new File([optimizedBlob], file.name.replace(/\.[^/.]+$/, '.webp'), {
          type: 'image/webp',
        })
      );
      formData.append('isProfile', 'true');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.url) {
        setPhotoUrl(result.url);
        onPhotoChange(result.url);
        showFeedback('success', 'Profile photo uploaded and saved successfully!');
        if (onRefresh) onRefresh();
      } else {
        showFeedback('error', result.error || 'Failed to upload photo.');
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      showFeedback('error', 'An error occurred while uploading your photo.');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Delete / Remove current profile photo
   */
  const handleDeletePhoto = async () => {
    setIsDeleting(true);
    setShowConfirmDelete(false);

    try {
      const response = await fetch('/api/admin/profile/photo', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        setPhotoUrl('');
        onPhotoChange('');
        showFeedback('success', 'Profile photo removed successfully.');
        if (onRefresh) onRefresh();
      } else {
        showFeedback('error', result.error || 'Failed to delete photo.');
      }
    } catch (err) {
      console.error('Delete photo error:', err);
      showFeedback('error', 'An error occurred while deleting your photo.');
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Apply photo from URL or Google Drive link
   */
  const handleApplyUrl = async (urlToApply?: string) => {
    const targetUrl = (urlToApply || inputUrl).trim();
    if (!targetUrl) {
      showFeedback('error', 'Please enter a valid image URL or Google Drive link.');
      return;
    }

    let finalUrl = targetUrl;
    if (isGoogleDriveUrl(targetUrl)) {
      finalUrl = getDriveThumbnailUrl(targetUrl, 1200);
    }

    setIsUploading(true);
    try {
      const response = await fetch('/api/admin/profile/photo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: finalUrl }),
      });

      const result = await response.json();

      if (response.ok) {
        setPhotoUrl(result.profileImage || finalUrl);
        onPhotoChange(result.profileImage || finalUrl);
        setInputUrl('');
        showFeedback('success', 'Profile photo updated and saved from URL!');
        if (onRefresh) onRefresh();
      } else {
        showFeedback('error', result.error || 'Failed to apply photo URL.');
      }
    } catch (err) {
      console.error('Apply URL error:', err);
      showFeedback('error', 'Failed to update photo from URL.');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Status badges
  const isDefaultPhoto = photoUrl === DEFAULT_DARSHAN_PHOTO;
  const isGoogleDrivePhoto = isGoogleDriveUrl(photoUrl);
  const isCustomUploaded = Boolean(photoUrl && !isDefaultPhoto && !isGoogleDrivePhoto);
  const hasNoPhoto = !photoUrl;

  return (
    <Card className="p-6 border-zinc-800 bg-zinc-950/80 shadow-2xl relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="p-0 pb-6 border-b border-zinc-800/80 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
                User Photo Management
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Supabase Synced
                </span>
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs mt-0.5">
                Upload, update, or remove your public profile portrait across the portfolio.
              </CardDescription>
            </div>
          </div>

          {/* Feedback Banner */}
          {statusMessage && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/15 text-red-300 border border-red-500/30'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Avatar Showcase & Quick Actions (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center relative group">
          {/* Avatar Preview Box */}
          <div className="relative mb-4">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-zinc-700 bg-zinc-950 relative shadow-xl ring-4 ring-amber-500/10 group-hover:border-amber-500/60 transition-all duration-300">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 160px, 192px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  unoptimized={photoUrl.startsWith('data:') || photoUrl.includes('drive.google.com')}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500">
                  <span className="text-3xl sm:text-4xl font-black text-amber-500/70 font-mono tracking-wider">
                    DP
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-2">No Photo Set</span>
                </div>
              )}

              {/* Lightbox Zoom Icon Button */}
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setShowLightbox(true)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-xs font-semibold text-white transition-opacity duration-200"
                  title="Click to view high-resolution photo"
                >
                  <Eye className="w-4 h-4" /> View Fullscreen
                </button>
              )}
            </div>

            {/* Photo Type Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              {hasNoPhoto && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700 shadow-sm">
                  Placeholder Monogram
                </span>
              )}
              {isCustomUploaded && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm flex items-center gap-1">
                  <Check className="w-3 h-3" /> Custom Photo
                </span>
              )}
              {isGoogleDrivePhoto && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm flex items-center gap-1">
                  <HardDrive className="w-3 h-3" /> Google Drive Link
                </span>
              )}
              {isDefaultPhoto && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Default Portrait
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 text-center">
            <h4 className="font-bold text-sm text-zinc-200">{name}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Visible on About page, Social Preview & Schema.org SEO
            </p>
          </div>

          {/* Action Row: Delete & View Actions */}
          <div className="mt-4 flex items-center justify-center gap-2 w-full pt-3 border-t border-zinc-800/80">
            {photoUrl && !showConfirmDelete && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setShowConfirmDelete(true)}
                disabled={isDeleting || isUploading}
                className="gap-1.5 text-xs flex-1 border border-red-500/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Photo</span>
              </Button>
            )}

            {showConfirmDelete && (
              <div className="flex flex-col gap-2 w-full animate-in fade-in duration-200">
                <span className="text-xs text-red-300 font-medium text-center">
                  Are you sure you want to remove your photo?
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeletePhoto}
                    disabled={isDeleting}
                    className="flex-1 text-xs"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfirmDelete(false)}
                    className="flex-1 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {!isDefaultPhoto && !showConfirmDelete && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleApplyUrl(DEFAULT_DARSHAN_PHOTO)}
                disabled={isUploading}
                className="gap-1 text-xs text-zinc-400 hover:text-zinc-200 border-zinc-700"
                title="Reset to default portrait"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Upload Tabs & URL Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Selection */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Photo File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'url'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              Google Drive / Web URL
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'presets'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Presets
            </button>
          </div>

          {/* Tab 1: Drag & Drop File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                    : 'border-zinc-700/80 bg-zinc-900/30 hover:border-amber-500/50 hover:bg-zinc-900/60'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
                  {isUploading ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>

                <h5 className="font-semibold text-sm text-zinc-100">
                  {isUploading
                    ? 'Uploading & Optimizing Photo...'
                    : 'Click or Drag & Drop Photo Here'}
                </h5>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  Supports JPG, PNG, WebP, GIF up to 10MB. Automatically optimized for retina displays.
                </p>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    className="gap-2 border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Browse Photo File
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
                <span>Recommended: Square (1:1) or Portrait (4:5)</span>
                <span>Minimum: 600 × 600 px</span>
              </div>
            </div>
          )}

          {/* Tab 2: Google Drive / Web URL */}
          {activeTab === 'url' && (
            <div className="space-y-4 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-400" /> Image URL / Google Drive Link
                </label>
                <Input
                  placeholder="https://drive.google.com/file/d/... or https://..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="font-mono text-xs bg-zinc-950 border-zinc-800 focus-visible:ring-amber-500/50"
                />
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Tip: Paste any public Google Drive sharing link — it will be automatically converted to a high-speed direct CDN preview.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  disabled={isUploading || !inputUrl.trim()}
                  onClick={() => handleApplyUrl()}
                  className="gap-1.5 text-xs flex-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isUploading ? 'Applying...' : 'Apply Photo URL'}
                </Button>
                {inputUrl.trim() && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setInputUrl('')}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Curated Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Quick Photo Presets
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Preset 1 */}
                <div
                  onClick={() => handleApplyUrl(DEFAULT_DARSHAN_PHOTO)}
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-amber-500/40 cursor-pointer flex items-center gap-3 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 border border-zinc-700">
                    <Image
                      src={DEFAULT_DARSHAN_PHOTO}
                      alt="Darshan Portrait"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                      Editorial Portrait
                    </p>
                    <p className="text-[11px] text-zinc-500">Official High-Res Look</p>
                  </div>
                </div>

                {/* Preset 2: Clear / Monogram */}
                <div
                  onClick={() => handleDeletePhoto()}
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-red-500/40 cursor-pointer flex items-center gap-3 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-amber-500 font-bold font-mono text-sm">
                    DP
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-zinc-200 group-hover:text-red-300 transition-colors">
                      Monogram Initial
                    </p>
                    <p className="text-[11px] text-zinc-500">Minimalist & clean</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && photoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] w-full rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-950 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[65vh] rounded-xl overflow-hidden bg-zinc-900">
              <Image
                src={photoUrl}
                alt={name}
                fill
                className="object-contain"
                unoptimized={photoUrl.startsWith('data:') || photoUrl.includes('drive.google.com')}
              />
            </div>
            <div className="p-3 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">{name} — Active Photo</span>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => window.open(photoUrl, '_blank')}
              >
                Open Original in New Tab
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
