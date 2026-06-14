'use client';

import { Check } from 'lucide-react';
import { useDict } from '@/i18n';

export default function QualitySection() {
  const dict = useDict();

  return (
    <section className="bg-[#062748] relative overflow-hidden">
      {/* Technical grid */}
      <div className="absolute inset-0 tech-grid" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            {/* Section label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#FF8A1F]" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                {dict.quality.sectionLabel}
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-[#F7FBFF] mb-8" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
              {dict.quality.title}
            </h2>

            {/* Certification badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {dict.quality.certifications.map((cert: string) => (
                <div key={cert} className="bg-[#08345F] border border-[#123D63] rounded-lg px-5 py-3 text-center hover:bg-[#FF8A1F]/10 hover:border-[#FF8A1F]/30 transition-all cursor-default">
                  <span className="text-sm font-bold text-[#F7FBFF] block" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                    {cert}
                  </span>
                  {cert.includes('CE') && <span className="text-[9px] text-[#7F9AB7] block mt-0.5">Certified</span>}
                  {cert.includes('FCC') && <span className="text-[9px] text-[#7F9AB7] block mt-0.5">Compliant</span>}
                  {cert.includes('RoHS') && <span className="text-[9px] text-[#7F9AB7] block mt-0.5">Compliant</span>}
                  {cert.includes('REACH') && <span className="text-[9px] text-[#7F9AB7] block mt-0.5">Compliant</span>}
                </div>
              ))}
            </div>

            <p className="text-sm text-[#C7D7E8] leading-relaxed max-w-md">
              {dict.quality.subtitle || 'Our quality process covers incoming materials, production inspection, function testing, aging tests, and outgoing quality control.'}
            </p>
          </div>

          {/* Right - checklist with amber checkmarks */}
          <div className="space-y-4">
            {dict.quality.checklist.map((check: string) => (
              <div key={check} className="flex items-center gap-3 group">
                <div className="w-5 h-5 rounded-full bg-[#FF8A1F] flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                  <Check className="w-3 h-3 text-[#062748]" strokeWidth={3} />
                </div>
                <span className="text-sm text-[#C7D7E8] group-hover:text-[#F7FBFF] transition-colors font-medium">{check}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
