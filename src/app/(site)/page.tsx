import { getPortfolioData } from '@/lib/portfolio';
import { Hero } from '@/components/public/Hero';
import { FeaturedProjects } from '@/components/public/FeaturedProjects';
import { ServicesSection } from '@/components/public/ServicesSection';
import { ProjectGrid } from '@/components/public/ProjectGrid';
import { AboutPreview } from '@/components/public/AboutPreview';
import { ContactSection } from '@/components/public/ContactSection';
import { Layers } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <div className="space-y-12">
      {/* Editorial Hero */}
      <Hero hero={data.hero} profile={data.profile} />

      {/* Featured Projects Highlight */}
      <FeaturedProjects
        projects={data.projects}
        limit={data.settings?.featuredProjectLimit || 6}
      />

      {/* Services Section */}
      <ServicesSection services={data.services} />

      {/* Selected Work with Live Filter */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            <Layers className="w-3.5 h-3.5" />
            Archive Catalog
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase">
            Selected Work
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            Browse through videos, retouching projects, and graphic designs categorized by craft.
          </p>
        </div>

        <ProjectGrid projects={data.projects} />
      </section>

      {/* About Section */}
      <AboutPreview profile={data.profile} about={data.about} />

      {/* Contact Section */}
      <ContactSection
        contact={data.contact}
        profile={data.profile}
        socials={data.socials}
      />
    </div>
  );
}
