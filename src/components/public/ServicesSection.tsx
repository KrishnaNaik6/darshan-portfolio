import { Service } from '@/types/portfolio';
import { Film, Image as ImageIcon, Palette, CheckCircle2, Layers } from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
}

const iconMap: Record<string, React.ReactNode> = {
  Film: <Film className="w-6 h-6 text-emerald-400" />,
  Image: <ImageIcon className="w-6 h-6 text-amber-400" />,
  Palette: <Palette className="w-6 h-6 text-indigo-400" />,
};

export function ServicesSection({ services }: ServicesSectionProps) {
  const sortedServices = [...services].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          <Layers className="w-3.5 h-3.5" />
          Creative Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase">
          What I Deliver
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Comprehensive post-production and visual design solutions tailored for digital-first creators, high-growth channels, and commercial campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sortedServices.map((service) => {
          const icon = iconMap[service.iconName || 'Film'] || (
            service.category === 'video' ? <Film className="w-6 h-6 text-emerald-400" /> :
            service.category === 'image' ? <ImageIcon className="w-6 h-6 text-amber-400" /> :
            <Palette className="w-6 h-6 text-indigo-400" />
          );

          return (
            <div
              key={service.id}
              className="relative group rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-8 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:-translate-y-1 shadow-lg shadow-black/40"
            >
              <div className="space-y-6">
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner group-hover:border-zinc-600 transition-colors">
                  {icon}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Features List */}
                {service.features && service.features.length > 0 && (
                  <div className="pt-4 border-t border-zinc-800/60 space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
