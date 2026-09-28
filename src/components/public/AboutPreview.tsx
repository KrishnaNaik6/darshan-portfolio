import Link from 'next/link';
import { Profile, About } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface AboutPreviewProps {
  profile: Profile;
  about: About;
}

export function AboutPreview({ profile, about }: AboutPreviewProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Profile Image / Editorial Frame */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl aspect-[4/5] max-w-md mx-auto">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 font-bold text-3xl">
                {profile.name}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                {profile.role || 'Visual Editor & Designer'}
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {profile.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Story & Skill Info */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              <Sparkles className="w-3.5 h-3.5" />
              About The Craft
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase">
              Driven by rhythm, color, and story.
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
              {about.description || profile.bio}
            </p>
          </div>

          {/* Stats Badges */}
          {about.stats && about.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-zinc-850">
              {about.stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-zinc-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Software Skills Pills */}
          {about.skills && about.skills.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Core Software & Capabilities
              </h4>
              <div className="flex flex-wrap gap-2">
                {about.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800"
                  >
                    <CheckCircle className="w-3 h-3 text-amber-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-wrap gap-4">
            <Link href="/about">
              <Button variant="default" className="gap-2 group">
                Read Full Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
