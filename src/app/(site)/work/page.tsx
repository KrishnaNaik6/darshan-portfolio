import { Metadata } from 'next';
import { getPortfolioData } from '@/lib/portfolio';
import { ProjectGrid } from '@/components/public/ProjectGrid';
import { Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const name = data.profile.name || 'Darshan G Poojari';
  return {
    title: `Selected Work & Creative Portfolio | ${name}`,
    description: `Explore the full catalog of ${data.projects.length}+ cinematic video edits, high-end photo retouching, and graphic design projects created by ${name}.`,
    keywords: [
      'Darshan G Poojari Work',
      'Darshan Poojari Portfolio',
      'Video Editing Showreel',
      'Cinematic Editing Portfolio',
      'Photo Retouching Projects',
      'YouTube Thumbnail Portfolio',
      'Graphic Design Showcase',
      'Video Editor Karnataka',
      'Freelance Video Editor India',
    ],
    alternates: {
      canonical: '/work',
    },
    openGraph: {
      title: `Selected Work & Portfolio | ${name}`,
      description: `Browse ${data.projects.length}+ curated video editing and visual design projects.`,
      url: '/work',
    },
  };
}

export default async function WorkPage() {
  const data = await getPortfolioData();

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Editorial Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
          <Layers className="w-3.5 h-3.5" />
          Complete Portfolio
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-100 uppercase">
          Craft & Creation
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
          Explore the full index of commercial reels, cinematic short cuts, editorial retouching, and brand visuals created for global clients.
        </p>
      </div>

      {/* Interactive Grid with Category Filter & Search */}
      <ProjectGrid projects={data.projects} showSearch={true} />
    </div>
  );
}
