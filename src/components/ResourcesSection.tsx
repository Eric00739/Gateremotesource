'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import { useDict, useLocale } from '@/i18n';

export default function ResourcesSection() {
  const dict = useDict();
  const locale = useLocale();
  const displayPosts = blogPosts.slice(0, 4);

  if (displayPosts.length === 0) return null;

  return (
    <section id="resources" className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[#FF8A1F]" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            {dict.resources.sectionLabel}
          </span>
        </div>

        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            {dict.resources.title}
          </h2>
          <Link href={`/${locale}/blog`} className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-bold text-[#FF8A1F] hover:text-[#F97316] transition-colors" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            {dict.resources.viewAll} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group block rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition-all hover:border-[#FF8A1F]/40 hover:shadow-sm"
            >
              <h3 className="mb-2 text-[14px] font-bold leading-snug text-[#0F172A]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>{post.title}</h3>
              <p className="mb-4 text-[12px] leading-relaxed text-[#64748B]">{post.excerpt}</p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF8A1F] transition-all group-hover:gap-2" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                {dict.resources.readMore} <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
