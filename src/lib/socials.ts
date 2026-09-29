import { Socials } from '@/types/portfolio';

export interface SocialPlatformConfig {
  key: keyof Omit<Socials, 'enabled'>;
  label: string;
  placeholder: string;
  colorClass: string;
  badgeBg: string;
  prefixUrl?: string;
  description: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/your_handle',
    colorClass: 'text-pink-400',
    badgeBg: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
    description: 'Reels, visual portfolio highlights, and story clips',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@your_channel',
    colorClass: 'text-red-400',
    badgeBg: 'bg-red-500/10 border-red-500/30 text-red-300',
    description: 'Full video edits, showreels, and client projects',
  },
  {
    key: 'behance',
    label: 'Behance',
    placeholder: 'https://behance.net/your_profile',
    colorClass: 'text-blue-400',
    badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    description: 'Graphic design case studies and typography layouts',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/your_profile',
    colorClass: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    description: 'Professional career profile and industry connections',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    placeholder: 'https://wa.me/91XXXXXXXXXX',
    colorClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    description: 'Direct instant messaging for client inquiries',
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    placeholder: 'https://x.com/your_handle',
    colorClass: 'text-zinc-200',
    badgeBg: 'bg-zinc-800 border-zinc-700 text-zinc-200',
    description: 'Quick thoughts, design updates, and creative news',
  },
  {
    key: 'github',
    label: 'GitHub',
    placeholder: 'https://github.com/your_username',
    colorClass: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    description: 'Code repositories and web experiments',
  },
];

/**
 * Checks if a specific social platform has a URL AND is enabled (not explicitly disabled)
 */
export function isSocialLinkActive(
  socials: Socials | undefined | null,
  key: keyof Omit<Socials, 'enabled'>
): boolean {
  if (!socials) return false;
  const url = socials[key];
  if (!url || typeof url !== 'string' || !url.trim()) return false;

  // If explicitly disabled (enabled[key] === false), return false
  if (socials.enabled && socials.enabled[key] === false) {
    return false;
  }

  return true;
}

/**
 * Gets all active social entries
 */
export function getActiveSocials(
  socials: Socials | undefined | null
): Array<{ key: keyof Omit<Socials, 'enabled'>; url: string; config: SocialPlatformConfig }> {
  if (!socials) return [];

  return SOCIAL_PLATFORMS.filter((config) => isSocialLinkActive(socials, config.key)).map(
    (config) => ({
      key: config.key,
      url: (socials[config.key] as string).trim(),
      config,
    })
  );
}
