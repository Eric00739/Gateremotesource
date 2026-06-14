'use client';

import { stats } from '@/data/homepage';
import { useDict } from '@/i18n';

export default function StatsSection() {
  const dict = useDict();

  const labelKeys = ['skuRange', 'marketSupport', 'sampleLeadTime', 'brandSystems', 'logoPackaging'];

  return (
    <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] relative">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF8A1F]/40 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat, i) => {
            return (
              <div key={stat.label} className="text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                {/* Calibration tick marks */}
                <div className="flex justify-center gap-[2px] mb-3">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className={`w-[1px] ${j % 2 === 0 ? 'h-3' : 'h-2'} ${j === 2 ? 'bg-[#FF8A1F]' : 'bg-[#CBD5E1]'} group-hover:bg-[#FF8A1F]/60 transition-colors`}
                    />
                  ))}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-1" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                  {stat.value}
                </div>
                <p className="text-[11px] text-[#64748B] tracking-wider uppercase font-medium" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                  {dict.stats[labelKeys[i]]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
