'use client';

import * as React from 'react';
import { extractGoogleDriveId, getDriveEmbedUrl, getDriveThumbnailUrl, getDriveDirectUrl } from '@/lib/media';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HardDrive, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, Play } from 'lucide-react';

export function DriveMediaTester() {
  const [inputUrl, setInputUrl] = React.useState('');
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const fileId = extractGoogleDriveId(inputUrl);
  const thumbnailUrl = fileId ? getDriveThumbnailUrl(fileId) : '';
  const embedUrl = fileId ? getDriveEmbedUrl(fileId) : '';
  const directUrl = fileId ? getDriveDirectUrl(fileId) : '';

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card className="p-6 border-zinc-800 bg-zinc-950/60 max-w-4xl">
      <CardHeader className="p-0 pb-6 border-b border-zinc-800 mb-6">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-amber-400" />
          <CardTitle className="text-lg text-zinc-100">Google Drive Media Link Tester</CardTitle>
        </div>
        <CardDescription>
          Paste any Google Drive sharing link here to test file ID extraction, thumbnail resolution, and embed player playback.
        </CardDescription>
      </CardHeader>

      <div className="space-y-6">
        {/* Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Paste Google Drive URL or File ID
          </label>
          <Input
            placeholder="https://drive.google.com/file/d/1A2b3C4d5E.../view?usp=sharing"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="text-sm font-mono"
          />
        </div>

        {/* Results */}
        {inputUrl && (
          <div className="space-y-6 animate-in fade-in">
            {fileId ? (
              <div className="p-4 rounded-xl border border-emerald-900/50 bg-emerald-950/20 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Valid Google Drive Media Detected</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 block uppercase text-[10px]">Extracted File ID</span>
                    <span className="text-zinc-200 font-bold break-all">{fileId}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 block uppercase text-[10px]">Direct Stream / Export</span>
                    <span className="text-zinc-200 break-all line-clamp-1">{directUrl}</span>
                  </div>
                </div>

                {/* Copy Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(embedUrl, 'embed')}
                    className="text-xs gap-1.5"
                  >
                    {copiedField === 'embed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Embed URL
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(thumbnailUrl, 'thumb')}
                    className="text-xs gap-1.5"
                  >
                    {copiedField === 'thumb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Thumbnail URL
                  </Button>
                  <a href={directUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Open in Drive
                    </Button>
                  </a>
                </div>

                {/* Live Preview Embed Player */}
                <div className="space-y-2 pt-4 border-t border-zinc-800/80">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-amber-400" /> Live Embed Preview
                  </div>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-black">
                    <iframe
                      src={embedUrl}
                      title="Google Drive Player Preview"
                      className="w-full h-full border-0"
                      allow="autoplay"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Note: If the preview shows a sign-in or access denied message, make sure your Drive file sharing is set to <strong>&quot;Anyone with the link can view&quot;</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-red-900/50 bg-red-950/20 flex items-start gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <div>
                  <span className="font-bold block">Could not parse Google Drive File ID</span>
                  Please make sure you copied a valid Google Drive link containing <code>/file/d/ID</code> or <code>?id=ID</code>.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
