'use client';

import * as React from 'react';
import { getMediaDisplayInfo, resolveThumbnailUrl } from '@/lib/media';
import { ProjectMediaType } from '@/types/portfolio';
import { ExternalLink, Play, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaViewerProps {
  mediaUrl: string;
  thumbnailUrl?: string;
  title: string;
  type?: ProjectMediaType;
  className?: string;
}

export function MediaViewer({
  mediaUrl,
  thumbnailUrl,
  title,
  type = 'video',
  className = '',
}: MediaViewerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const mediaInfo = React.useMemo(() => {
    return getMediaDisplayInfo(mediaUrl, type);
  }, [mediaUrl, type]);

  const resolvedThumb = resolveThumbnailUrl(thumbnailUrl || mediaInfo.thumbnailUrl);

  // If it's a direct image
  if (type === 'image' || mediaInfo.isImage) {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 ${className}`}>
        <img
          src={mediaInfo.directUrl || resolvedThumb}
          alt={title}
          className="w-full h-auto max-h-[80vh] object-contain mx-auto"
          onError={() => setHasError(true)}
        />
        {mediaInfo.isDrive && (
          <div className="p-3 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Stored on Google Drive</span>
            <a
              href={mediaInfo.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-300 hover:text-white"
            >
              Open original <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    );
  }

  // If it's a video: provide responsive player
  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video shadow-2xl ${className}`}>
      {/* If user hasn't pressed play yet and we have a thumbnail: show poster preview */}
      {!isPlaying && resolvedThumb ? (
        <div className="relative w-full h-full cursor-pointer group" onClick={() => setIsPlaying(true)}>
          <img
            src={resolvedThumb}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <button
              type="button"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-300"
              aria-label={`Play ${title}`}
            >
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="text-xs px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10">
              {mediaInfo.isDrive ? 'Google Drive Video' : mediaInfo.isYouTube ? 'YouTube Video' : 'Video Player'}
            </span>
          </div>
        </div>
      ) : (
        /* Video Embed / Direct Video Player */
        <div className="w-full h-full relative">
          {mediaInfo.embedUrl ? (
            <iframe
              src={mediaInfo.embedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : mediaInfo.isDirectVideo ? (
            <video
              src={mediaInfo.directUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
              onError={() => setHasError(true)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              src={mediaUrl}
              title={title}
              className="w-full h-full border-0"
              allowFullScreen
            />
          )}
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500" />
          <p className="text-sm text-zinc-300">Could not directly stream video inside player.</p>
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button size="sm" variant="outline" className="gap-1.5">
              Open Media Directly <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
