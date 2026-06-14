'use client';

import { Shield, AlertTriangle, FileSearch, FlaskConical, Package, FileCheck, Info } from 'lucide-react';
import { riskCards } from '@/data/homepage';
import { useDict } from '@/i18n';

const iconMap = [Shield, AlertTriangle, FileSearch, FlaskConical, Package, FileCheck];

export default function RiskControlSection() {
  const dict = useDict();
  const cards = dict.risk.cards || riskCards;

  return (
    <section className="bg-[#F8FAFC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[#FF8A1F]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            {dict.risk.sectionLabel}
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-12 max-w-2xl" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
          {dict.risk.title}
        </h2>

        {/* 6-column single row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {cards.map((card: { title: string; description: string }, i: number) => {
            const Icon = iconMap[i];
            return (
              <div key={card.title} className="text-center group">
                {/* Amber outlined circle icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-[#FF8A1F]/25 flex items-center justify-center group-hover:bg-[#FF8A1F]/10 group-hover:border-[#FF8A1F]/50 transition-all duration-300">
                  <Icon className="w-5 h-5 text-[#FF8A1F]" />
                </div>
                <h3 className="text-[12px] font-bold text-[#0F172A] mb-2 leading-snug" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>{card.title}</h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{card.description}</p>
              </div>
            );
          })}
        </div>

        {/* Legal disclaimer */}
        <div className="bg-white rounded-lg p-5 border border-[#E2E8F0]">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#FF8A1F] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#475569] leading-relaxed">
                {dict.risk.disclaimer}
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-2" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                {dict.risk.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
