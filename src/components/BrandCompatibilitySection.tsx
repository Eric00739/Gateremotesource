'use client';

import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { brands, compatibilityRows } from '@/data/homepage';
import { useDict, useLocale } from '@/i18n';

export default function BrandCompatibilitySection() {
  const dict = useDict();
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const labelMap: Record<string, string> = {
    Available: dict.compatibilityTable.available || 'Available',
    'To Confirm': dict.compatibilityTable.toConfirm || 'To Confirm',
    Recommended: dict.compatibilityTable.recommended || 'Recommended',
    Yes: dict.compatibilityTable.yes || 'Yes',
    'Rolling Code': dict.compatibilityTable.rollingCode || 'Rolling Code',
  };
  const localizeValue = (value: string) => labelMap[value] || value;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredRows = useMemo(() => {
    if (!normalizedQuery) return compatibilityRows;

    return compatibilityRows.filter((row) =>
      [row.brand, row.model, row.frequency, row.codeType, row.solution, row.sampleTest]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  return (
    <section id="compatibility" className="bg-white relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[#FF8A1F]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            {dict.compatibilityTable.title}
          </span>
        </div>

        <div className="max-w-2xl mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            {dict.compatibilityTable.title}
          </h2>
          <p className="text-[#64748B] leading-relaxed">
            {dict.compatibilityTable.subtitle}
          </p>
        </div>

        <div className="relative max-w-xl mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.compatibilityTable.searchPlaceholder}
            className="w-full rounded-lg border border-[#D8E4F0] bg-[#F8FAFC] py-3 pl-11 pr-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-colors focus:border-[#FF8A1F]/60 focus:bg-white"
          />
        </div>

        <div className="lg:hidden space-y-3 mb-6">
          {filteredRows.map((row) => (
            <div key={`${row.brand}-${row.model}`} className="rounded-lg border border-[#D8E4F0] bg-white p-4 shadow-sm shadow-[#062748]/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                    {dict.compatibilityTable.brandHeader}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                    {row.brand}
                  </h3>
                </div>
                <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${row.solution === 'Available' ? 'bg-[#FF8A1F]/10 text-[#C45A00]' : 'bg-[#EFF6FF] text-[#1D4ED8]'}`}>
                  {localizeValue(row.solution)}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#94A3B8]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{dict.compatibilityTable.modelHeader}</p>
                  <p className="mt-1 font-semibold text-[#153A5C]">{row.model}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#94A3B8]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{dict.compatibilityTable.frequencyHeader}</p>
                  <p className="mt-1 font-semibold text-[#153A5C]">{row.frequency}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#94A3B8]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{dict.compatibilityTable.codeTypeHeader}</p>
                  <p className="mt-1 text-[#64748B]">{localizeValue(row.codeType)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#94A3B8]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{dict.compatibilityTable.sampleTestHeader}</p>
                  <p className="mt-1 text-[#64748B]">{localizeValue(row.sampleTest)}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredRows.length === 0 && (
            <div className="rounded-lg border border-[#D8E4F0] bg-white px-5 py-8 text-center text-sm text-[#64748B]">
              {dict.compatibilityTable.noMatch}
            </div>
          )}
        </div>

        <div className="hidden lg:block overflow-hidden rounded-lg border border-[#D8E4F0] bg-white shadow-sm shadow-[#062748]/5 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#F8FAFC] text-[11px] uppercase tracking-[0.14em] text-[#64748B]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                <tr>
                  <th className="px-5 py-4 font-semibold">{dict.compatibilityTable.brandHeader}</th>
                  <th className="px-5 py-4 font-semibold">{dict.compatibilityTable.modelHeader}</th>
                  <th className="px-5 py-4 font-semibold">{dict.compatibilityTable.frequencyHeader}</th>
                  <th className="px-5 py-4 font-semibold">{dict.compatibilityTable.codeTypeHeader}</th>
                  <th className="px-5 py-4 font-semibold">{dict.compatibilityTable.solutionHeader}</th>
                  <th className="px-5 py-4 font-semibold">{dict.compatibilityTable.sampleTestHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredRows.map((row) => (
                  <tr key={`${row.brand}-${row.model}`} className="text-sm text-[#0F172A]">
                    <td className="px-5 py-4 font-bold">{row.brand}</td>
                    <td className="px-5 py-4">{row.model}</td>
                    <td className="px-5 py-4 text-[#475569]">{row.frequency}</td>
                    <td className="px-5 py-4 text-[#475569]">{localizeValue(row.codeType)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${row.solution === 'Available' ? 'bg-[#FF8A1F]/10 text-[#C45A00]' : 'bg-[#EFF6FF] text-[#1D4ED8]'}`}>
                        {localizeValue(row.solution)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#475569]">{localizeValue(row.sampleTest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-[#64748B]">
              {dict.compatibilityTable.noMatch}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 mb-6">
          {brands.slice(0, 18).map((brand) => (
            <span key={brand} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[12px] font-semibold text-[#153A5C]">
              {brand}
            </span>
          ))}
          <span className="rounded-lg border border-[#FF8A1F]/25 bg-[#FF8A1F]/8 px-3 py-2 text-[12px] font-bold text-[#C45A00]">
            {dict.compatibilityTable.andMore || 'And more...'}
          </span>
        </div>

        <div className="flex items-start gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-5 py-4 max-w-3xl">
          <div className="w-5 h-5 rounded-full bg-[#FF8A1F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[#FF8A1F] text-[10px] font-bold">i</span>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-[#64748B] leading-relaxed">
              {dict.compatibilityTable.disclaimer}
            </p>
            <Link href={`/${locale}/compatibility`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF8A1F] transition-colors hover:text-[#F97316]">
              {dict.compatibilityTable.viewAll} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
