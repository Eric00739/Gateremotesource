'use client';

import Image from 'next/image';
import { basePath } from '@/data/homepage';
import LeadModalTrigger from './LeadModalTrigger';
import { useDict } from '@/i18n';

export default function CtaSection() {
  const dict = useDict();

  return (
    <section className="bg-[#062748] relative overflow-hidden">
      {/* Technical grid */}
      <div className="absolute inset-0 tech-grid" />

      {/* RF waveform decoration */}
      <svg className="absolute bottom-0 left-0 right-0 opacity-10" viewBox="0 0 1200 80" preserveAspectRatio="none" style={{ height: '80px' }}>
        <path d="M0,40 Q150,10 300,40 T600,40 T900,40 T1200,40" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
        <path d="M0,40 Q75,25 150,40 T300,40 T450,40 T600,40 T750,40 T900,40 T1050,40 T1200,40" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
      </svg>

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#FF8A1F]" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                {dict.cta.sectionLabel}
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-[#F7FBFF] mb-4" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
              {dict.cta.title}
            </h2>
            <p className="text-[#C7D7E8] leading-relaxed mb-8 max-w-md">
              {dict.cta.subtitle}
            </p>
            <LeadModalTrigger
              prefillType="support"
              className="btn-glow inline-block bg-[#FF8A1F] hover:bg-[#F97316] text-[#062748] font-bold px-10 py-4 rounded-lg transition-all hover:shadow-xl hover:shadow-amber-500/20 text-[14px] cursor-pointer"
            >
              {dict.cta.button}
            </LeadModalTrigger>
          </div>

          {/* Right: Product image */}
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-[4/3] bg-[#08345F] border border-[#123D63] rounded-lg flex items-center justify-center relative overflow-hidden">
              <Image
                src={basePath + '/images/product-remotes.png'}
                alt="Compatible replacement remotes"
                fill
                className="object-contain p-8"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
