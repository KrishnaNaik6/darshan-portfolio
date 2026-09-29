import Link from 'next/link';
import { Socials, Profile } from '@/types/portfolio';
import {
  MessageCircle,
  Lock
} from 'lucide-react';
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  BehanceIcon,
  TwitterIcon,
  GithubIcon,
} from '@/components/ui/social-icons';
import { isSocialLinkActive } from '@/lib/socials';

interface FooterProps {
  profile: Profile;
  socials: Socials;
}

export function Footer({ profile, socials }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-800/60">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-zinc-100 tracking-wider uppercase">
                {profile.name || 'DARSHAN'}
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              {profile.bio ||
                'Visual editor & designer specializing in cinematic video cutting, precision retouching, and striking digital graphics.'}
            </p>
            {profile.location && (
              <p className="text-xs text-zinc-500 flex items-center gap-1.5 pt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Based in {profile.location}
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-200">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/work" className="hover:text-zinc-100 transition-colors">
                  Featured Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-zinc-100 transition-colors">
                  About & Skills
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zinc-100 transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-200">
              Connect
            </h4>
            <div className="flex flex-col space-y-2 text-sm">
              {isSocialLinkActive(socials, 'instagram') && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-pink-400 transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-zinc-400" />
                  Instagram
                </a>
              )}
              {isSocialLinkActive(socials, 'youtube') && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-red-400 transition-colors"
                >
                  <YoutubeIcon className="w-4 h-4 text-zinc-400" />
                  YouTube
                </a>
              )}
              {isSocialLinkActive(socials, 'behance') && (
                <a
                  href={socials.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <BehanceIcon className="w-4 h-4 text-zinc-400" />
                  Behance
                </a>
              )}
              {isSocialLinkActive(socials, 'linkedin') && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-sky-400 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4 text-zinc-400" />
                  LinkedIn
                </a>
              )}
              {isSocialLinkActive(socials, 'whatsapp') && (
                <a
                  href={socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  WhatsApp
                </a>
              )}
              {isSocialLinkActive(socials, 'twitter') && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-zinc-100 transition-colors"
                >
                  <TwitterIcon className="w-4 h-4 text-zinc-400" />
                  X (Twitter)
                </a>
              )}
              {isSocialLinkActive(socials, 'github') && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-purple-400 transition-colors"
                >
                  <GithubIcon className="w-4 h-4 text-zinc-400" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {currentYear} {profile.name || 'Darshan'}. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-300 transition-colors py-1 px-2 rounded border border-transparent hover:border-zinc-800"
              title="Admin Dashboard Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
