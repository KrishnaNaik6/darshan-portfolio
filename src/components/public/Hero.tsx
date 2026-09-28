import Link from 'next/link';
import { Hero as HeroType, Profile } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUpRight, Film, Image as ImageIcon, Palette } from 'lucide-react';

interface HeroProps {
  hero: HeroType;
  profile: Profile;
}

export function Hero({ hero, profile }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-28 pb-20 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Grid overlay for subtle editorial structure */}
      <div className="absolute inset-0 editorial-grid-bg opacity-40 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Availability / Artist Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800/90 bg-zinc-900/80 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
            {profile.name || 'Darshan G Poojari'} • {profile.role || 'Video Editor & Multimedia Designer'}
          </span>
        </div>

        {/* Big Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-100 leading-[1.05] uppercase">
          {hero.title || 'Visuals that tell the story.'}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
          {hero.subtitle ||
            'Video editing, precision photo retouching, and graphic design crafted for ambitious creators and forward-thinking brands.'}
        </p>

        {/* Specialization Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
            <Film className="w-3.5 h-3.5" />
            Video Editing
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/40 text-amber-400 border border-amber-800/40">
            <ImageIcon className="w-3.5 h-3.5" />
            Image Editing
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/40 text-indigo-400 border border-indigo-800/40">
            <Palette className="w-3.5 h-3.5" />
            Graphic Design
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/work" className="w-full sm:w-auto">
            <Button size="lg" variant="default" className="w-full sm:w-auto gap-2 group text-base px-8 h-12 shadow-xl shadow-zinc-100/5">
              {hero.primaryCta || 'View My Work'}
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 group text-base px-8 h-12">
              {hero.secondaryCta || "Let's Work Together"}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
