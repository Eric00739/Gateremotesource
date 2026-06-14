'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { products } from '@/data/homepage';
import LeadModalTrigger from './LeadModalTrigger';
import { useDict } from '@/i18n';

const productKeys = ['replacementRemotes', 'universalReceivers', 'duplicators', 'controllers', 'accessories', 'oemCustom'] as const;
const specValKeys = {
  replacementRemotes: ['frequencyVal', 'codeTypeVal', 'batteryVal', 'moqVal', 'oemVal'],
  universalReceivers: ['frequencyVal', 'codeTypeVal', 'powerVal', 'moqVal', 'oemVal'],
  duplicators: ['frequencyVal', 'codeTypeVal', 'batteryVal', 'moqVal', 'oemVal'],
  controllers: ['frequencyVal', 'codeTypeVal', 'powerVal', 'moqVal', 'oemVal'],
  accessories: ['itemsVal', 'fitmentVal', 'moqVal', 'oemVal'],
  oemCustom: ['frequencyVal', 'codeTypeVal', 'moqVal', 'oemVal'],
};

export default function ProductCategoriesSection() {
  const dict = useDict();

  return (
    <section id="products" className="bg-[#F8FAFC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[#FF8A1F]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            {dict.products.sectionLabel}
          </span>
        </div>

        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            {dict.products.title}
          </h2>
          <p className="text-[#64748B] leading-relaxed">
            {dict.products.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, idx) => {
            const pKey = productKeys[idx];
            const pDict = dict.product[pKey];
            const vals = specValKeys[pKey];

            return (
              <div
                key={product.title}
                className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden card-hover-light group"
              >
                {/* Product image area */}
                <div className="h-52 bg-white relative overflow-hidden flex items-center justify-center p-6">
                  <Image
                    src={product.image}
                    alt={pDict.title}
                    width={300}
                    height={200}
                    className="object-contain w-full h-full"
                  />
                  {/* Amber accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF8A1F]/40 to-transparent" />
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-[15px] font-bold text-[#0F172A] mb-2" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>{pDict.title}</h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed mb-5">{pDict.description}</p>

                  <div className="space-y-2 mb-5">
                    {product.specs.map((spec, si) => (
                      <div key={`${product.title}-${spec.label}`} className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] pb-2 last:border-b-0 last:pb-0">
                        <span className="text-[10px] uppercase tracking-[0.12em] text-[#94A3B8]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                          {spec.label}
                        </span>
                        <span className="max-w-[62%] text-right text-[12px] font-semibold text-[#153A5C]">
                          {pDict[vals[si]]}
                        </span>
                      </div>
                    ))}
                  </div>

                  <LeadModalTrigger
                    prefillType="quote"
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#FF8A1F] hover:text-[#F97316] transition-colors group/link pointer-events-auto"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    {dict.products.sendInquiry}
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </LeadModalTrigger>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
