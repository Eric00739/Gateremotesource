'use client';

import Link from 'next/link';
import { ArrowRight, Factory, FileText, RadioTower, Settings } from 'lucide-react';
import { homepageCapabilities } from '@/data/servicePages';
import { useDict, useLocale } from '@/i18n';

const icons = [RadioTower, Settings, Factory, FileText];

export default function CapabilityHighlightsSection() {
  const locale = useLocale();
  const dict = useDict();
  const section = dict.servicePages?.homepage;
  const capabilityCopy = dict.servicePages?.homepageCapabilities || homepageCapabilities;

  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[#FF8A1F]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
            {section?.sectionLabel || 'Buyer Paths'}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {section?.title || 'Public references first. Catalog access after matching.'}
            </h2>
            <p className="text-[#64748B] leading-relaxed max-w-xl">
              {section?.subtitle || 'The site separates compatibility education, OEM development, factory proof, and private catalog requests so buyers move through a safer verification path.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {homepageCapabilities.map((item, index) => {
              const Icon = icons[index];
              const href = `/${locale}${item.href}`;
              const copy = capabilityCopy[index] || item;

              return (
                <Link
                  key={item.title}
                  href={href}
                  className="group rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition-all hover:-translate-y-0.5 hover:border-[#FF8A1F]/40 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#FF8A1F]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#94A3B8] transition-transform group-hover:translate-x-1 group-hover:text-[#FF8A1F]" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {copy.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{copy.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
