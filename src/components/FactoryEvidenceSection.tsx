'use client';

import Image from 'next/image';
import { factoryItems } from '@/data/homepage';
import { useDict } from '@/i18n';

export default function FactoryEvidenceSection() {
  const dict = useDict();
  const itemNames = dict.factory.items || [];

  return (
    <section id="factory" className="bg-[#F8FAFC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[#FF8A1F]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            {dict.factory.sectionLabel}
          </span>
        </div>

        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
              {dict.factory.title}
            </h2>
            <p className="text-[#64748B]">
              {dict.factory.subtitle || 'See how we control production, testing, packaging, and delivery.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {factoryItems.map((item, index) => {
            const name = itemNames[index] || item.name;
            return (
            <div
              key={item.name}
              className="rounded-lg overflow-hidden bg-white border border-[#E2E8F0] card-hover-light group"
            >
              <div className="h-40 relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF8A1F]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-3">
                <p className="text-[12px] font-semibold text-[#0F172A] text-center" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>{name}</p>
              </div>
            </div>
          );})}
        </div>
      </div>
    </section>
  );
}
