/**
 * Media & Google Drive Utility for Darshan Portfolio
 * Centralized handling for Google Drive media links, video embeds, and image resolution.
 */

export interface MediaDisplayInfo {
  isDrive: boolean;
  isYouTube: boolean;
  isVimeo: boolean;
  isDirectVideo: boolean;
  isImage: boolean;
  embedUrl: string | null;
  thumbnailUrl: string;
  directUrl: string;
  originalUrl: string;
  fileId: string | null;
}

/**
 * Extracts Google Drive file ID from various sharing, preview, and uc URL patterns.
 */
export function extractGoogleDriveId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();

  // Pattern 1: /file/d/FILE_ID/...
  const fileDPattern = /\/file\/d\/([a-zA-Z0-9_-]{20,})/;
  const matchD = trimmed.match(fileDPattern);
  if (matchD && matchD[1]) return matchD[1];

  // Pattern 2: id=FILE_ID query param
  const idParamPattern = /[?&]id=([a-zA-Z0-9_-]{20,})/;
  const matchId = trimmed.match(idParamPattern);
  if (matchId && matchId[1]) return matchId[1];

  // Pattern 3: lh3.googleusercontent.com/d/FILE_ID
  const lh3Pattern = /googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/;
  const matchLh3 = trimmed.match(lh3Pattern);
  if (matchLh3 && matchLh3[1]) return matchLh3[1];

  // Pattern 4: Raw file ID (usually 25-45 alphanumeric characters with underscores/hyphens)
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed) && !trimmed.startsWith('http')) {
    return trimmed;
  }

  return null;
}

/**
 * Returns true if the string is a Google Drive URL or Drive ID
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return Boolean(
    url.includes('drive.google.com') ||
    url.includes('googleusercontent.com') ||
    extractGoogleDriveId(url)
  );
}

/**
 * Converts a Google Drive URL/ID to high-resolution thumbnail URL
 */
export function getDriveThumbnailUrl(urlOrId: string, size = 1200): string {
  const fileId = extractGoogleDriveId(urlOrId);
  if (!fileId) return urlOrId;
  // Google Drive thumbnail direct endpoint
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

/**
 * Converts a Google Drive URL/ID to preview embed iframe URL for video player
 */
export function getDriveEmbedUrl(urlOrId: string): string {
  const fileId = extractGoogleDriveId(urlOrId);
  if (!fileId) return urlOrId;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Converts a Google Drive URL/ID to direct view/export URL
 */
export function getDriveDirectUrl(urlOrId: string): string {
  const fileId = extractGoogleDriveId(urlOrId);
  if (!fileId) return urlOrId;
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Helper to parse YouTube video IDs
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

/**
 * Helper to parse Vimeo video IDs
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  return match ? match[1] : null;
}

/**
 * Comprehensive parser for any media URL (Drive, Direct, YouTube, Vimeo, Image)
 */
export function getMediaDisplayInfo(mediaUrl: string, type: 'video' | 'image' = 'image'): MediaDisplayInfo {
  const trimmed = (mediaUrl || '').trim();
  const driveId = extractGoogleDriveId(trimmed);
  const ytId = extractYouTubeId(trimmed);
  const vimeoId = extractVimeoId(trimmed);
  
  const isDirectVideo = Boolean(
    trimmed.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i)
  );

  let embedUrl: string | null = null;
  let directUrl = trimmed;
  let thumbnailUrl = trimmed;

  if (driveId) {
    embedUrl = getDriveEmbedUrl(driveId);
    directUrl = getDriveDirectUrl(driveId);
    thumbnailUrl = getDriveThumbnailUrl(driveId);
  } else if (ytId) {
    embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
    directUrl = `https://www.youtube.com/watch?v=${ytId}`;
    thumbnailUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  } else if (vimeoId) {
    embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
    directUrl = `https://vimeo.com/${vimeoId}`;
    thumbnailUrl = '';
  } else if (isDirectVideo) {
    embedUrl = null;
    directUrl = trimmed;
  }

  return {
    isDrive: Boolean(driveId),
    isYouTube: Boolean(ytId),
    isVimeo: Boolean(vimeoId),
    isDirectVideo,
    isImage: type === 'image' && !ytId && !vimeoId && !isDirectVideo,
    embedUrl,
    thumbnailUrl,
    directUrl,
    originalUrl: trimmed,
    fileId: driveId
  };
}

/**
 * Normalizes thumbnail image URL: if it's a Drive URL, format it properly, else return as-is
 */
export function resolveThumbnailUrl(thumbnailUrl: string, fallbackUrl = '/placeholder-project.jpg'): string {
  if (!thumbnailUrl || !thumbnailUrl.trim()) return fallbackUrl;
  const trimmed = thumbnailUrl.trim();
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return getDriveThumbnailUrl(driveId, 1200);
  }
  return trimmed;
}
