import { Metadata } from 'next';
import Link from 'next/link';
import { getPortfolioData } from '@/lib/portfolio';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  MapPin,
  Clock
} from 'lucide-react';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const name = data.profile.name || 'Darshan G Poojari';
  return {
    title: `About ${name} — Video Editor & Multimedia Designer`,
    description: `Learn more about ${name}, background in multimedia production, editing philosophy, software toolkit (Premiere Pro, DaVinci Resolve, Photoshop), and education.`,
    keywords: [
      `About ${name}`,
      'Darshan G Poojari Bio',
      'Darshan Poojari Video Editor',
      'Darshan Poojari Sirsi Karnataka',
      'Video Editor Biography',
      'Multimedia Designer India',
      'Government Polytechnic Siddapur Alumni',
    ],
    alternates: {
      canonical: '/about',
    },
    openGraph: {
      title: `About ${name} | Video Editor & Designer`,
      description: `Learn more about ${name}'s journey, background, and editing craft.`,
      url: '/about',
    },
  };
}

export default async function AboutPage() {
  const data = await getPortfolioData();
  const { profile, about } = data;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Big Image */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[4/5] shadow-2xl max-w-md mx-auto">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-3xl font-black text-zinc-600">
                {profile.name}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-6 left-6 right-6 space-y-1">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                {profile.role}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {profile.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Right: Bio & Story */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            <Sparkles className="w-3.5 h-3.5" />
            The Story Behind The Screen
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase">
            Crafting visual energy with purpose.
          </h2>

          <div className="text-zinc-300 text-base sm:text-lg leading-relaxed space-y-4 font-light whitespace-pre-line">
            {about.story || about.description || profile.bio}
          </div>

          <div className="flex flex-wrap gap-4 pt-4 text-xs text-zinc-400">
            {profile.location && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.availabilityStatus && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.availabilityStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Numbers */}
      {about.stats && about.stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 px-8 rounded-3xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-sm">
          {about.stats.map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Breakdown */}
      {about.skills && about.skills.length > 0 && (
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-100">
              Software & Technical Expertise
            </h3>
            <p className="text-sm text-zinc-400 max-w-xl">
              Industry-standard non-linear editing software, audio mastering suites, and digital manipulation engines.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {about.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-zinc-200">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience History */}
      {about.experience && about.experience.length > 0 && (
        <div className="space-y-8 border-t border-zinc-900 pt-16">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-100">
              Career Highlights & Experience
            </h3>
            <p className="text-sm text-zinc-400">
              A track record of post-production leadership and collaborative client deliverables.
            </p>
          </div>

          <div className="space-y-6">
            {about.experience.map((exp, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-lg font-bold text-zinc-100">{exp.role}</h4>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/30 px-2.5 py-1 rounded border border-amber-800/40 self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  {exp.company}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed font-light pt-1">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center py-16 px-6 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950 space-y-6">
        <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-100">
          Ready to elevate your visual content?
        </h3>
        <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
          Let&apos;s build an unforgettable edit, campaign, or digital artwork together.
        </p>
        <div>
          <Link href="/contact">
            <Button size="lg" variant="default" className="gap-2 font-bold px-8">
              Start a Conversation
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
