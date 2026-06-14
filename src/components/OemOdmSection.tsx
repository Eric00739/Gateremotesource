'use client';

import { Palette, Radio, Box, LayoutGrid, Settings, Package, FileText, Factory } from 'lucide-react';
import { oemSteps } from '@/data/homepage';
import { useDict } from '@/i18n';

const iconMap = [Palette, Radio, Box, LayoutGrid, Settings, Package, FileText, Factory];

export default function OemOdmSection() {
  const dict = useDict();

  return (
    <section id="oem-odm" className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[#FF8A1F]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            {dict.oem.sectionLabel}
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
          {dict.oem.title}
        </h2>
        <p className="text-[#64748B] mb-14 max-w-xl">
          {dict.oem.subtitle || 'From concept to mass production, we handle every step of your custom RF solution.'}
        </p>

        {/* Horizontal flow grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-4">
          {oemSteps.map((step, i) => {
            const Icon = iconMap[i];
            return (
              <div key={step.step} className="text-center group">
                {/* Numbered circle */}
                <div className="relative inline-block mb-3">
                  <div className="w-14 h-14 mx-auto bg-[#F8FAFC] rounded-full flex items-center justify-center border-2 border-[#E2E8F0] group-hover:bg-[#FF8A1F] group-hover:border-[#FF8A1F] transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#0F172A] group-hover:text-white transition-colors" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FF8A1F] rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <span className="text-white text-[10px] font-bold" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                      {step.step}
                    </span>
                  </div>
                </div>
                <h3 className="text-[13px] font-bold text-[#0F172A] mb-1" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>{step.title}</h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
