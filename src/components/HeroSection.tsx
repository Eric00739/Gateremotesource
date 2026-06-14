'use client';

import { Shield, Zap, Package, Globe, Users } from 'lucide-react';
import { basePath } from '@/data/homepage';
import LeadModalTrigger from './LeadModalTrigger';
import { useDict } from '@/i18n';

const trustItems = [
  { icon: Shield },
  { icon: Zap },
  { icon: Package },
  { icon: Globe },
  { icon: Users },
];

export default function HeroSection() {
  const dict = useDict();

  return (
    <section className="relative overflow-hidden">
      {/* Deep background */}
      <div className="absolute inset-0 bg-[#062748]" />

      {/* Technical grid */}
      <div className="absolute inset-0 tech-grid" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Amber subtitle */}
            <p className="animate-fade-in-up delay-100 text-[#FF8A1F] font-bold text-lg mb-6 tracking-wide" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {dict.hero.tagline}
            </p>

            <h1 className="animate-fade-in-up delay-200 text-3xl sm:text-4xl lg:text-[3.5rem] font-bold text-[#F7FBFF] leading-[1.1] mb-6" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {dict.hero.title}
            </h1>

            <p className="animate-fade-in-up delay-300 text-base text-[#C7D7E8] leading-relaxed mb-10 max-w-lg">
              {dict.hero.subtitle}
            </p>

            <div className="animate-fade-in-up delay-400 flex flex-wrap gap-4">
              <LeadModalTrigger
                prefillType="compatibility"
                className="btn-glow bg-[#FF8A1F] hover:bg-[#F97316] text-[#062748] font-bold px-8 py-3.5 rounded-lg transition-all hover:shadow-xl hover:shadow-amber-500/20 text-[14px]"
              >
                {dict.hero.modelDetailsCta}
              </LeadModalTrigger>
              <a
                href="#compatibility"
                className="group border border-[#2A587C] hover:border-[#FF8A1F]/40 text-[#C7D7E8] hover:text-[#F7FBFF] font-medium px-8 py-3.5 rounded-lg transition-all text-[14px] flex items-center gap-2 cursor-pointer"
              >
                {dict.hero.supportedBrandsCta}
                <span className="text-[#FF8A1F] group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Right: Product showcase */}
          <div className="animate-slide-in-right delay-300">
            <div className="relative bg-[#08345F]/80 border border-[#123D63] rounded-lg p-2 backdrop-blur-sm transition-colors duration-300 hover:border-[#FF8A1F]/35">
              <div className="relative overflow-hidden rounded-md bg-[#062748] aspect-video">
                <video
                  className="h-full w-full object-cover opacity-90"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={basePath + '/videos/gateremote-hero-poster.webp'}
                  aria-label="GateRemoteSource factory production video"
                >
                  <source src={basePath + '/videos/gateremote-hero-mobile.mp4'} type="video/mp4" media="(max-width: 768px)" />
                  <source src={basePath + '/videos/gateremote-hero.mp4'} type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#062748]/55 via-transparent to-[#FF8A1F]/10" />
                <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-[#FF8A1F]/25 bg-[#062748]/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFB15C] backdrop-blur-sm" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                  Factory Video
                </div>
              </div>
              <p className="text-[#7F9AB7] text-[10px] tracking-widest mt-4 text-center" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                {dict.hero.caption}
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-20 pt-8 border-t border-[#123D63]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                  <div className="w-8 h-8 bg-[#FF8A1F]/8 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#FF8A1F]/20">
                    <Icon className="w-3.5 h-3.5 text-[#FF8A1F]" />
                  </div>
                  <span className="text-[11px] font-medium text-[#C7D7E8] leading-snug">{dict.hero.trustItems[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
