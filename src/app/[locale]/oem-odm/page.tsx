import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Box, FileText, Package, Palette, Radio, Settings } from 'lucide-react';
import LeadModalTrigger from '@/components/LeadModalTrigger';
import { oemSteps } from '@/data/homepage';
import { oemPage } from '@/data/servicePages';
import { type Locale, locales } from '@/i18n';
import { getDictSync } from '@/i18n/dictionaries';
import { siteName } from '@/data/site';
import { absoluteUrl, breadcrumbJsonLd, jsonLd, localizedAlternates } from '@/lib/seo';

const iconMap = [Palette, Radio, Box, Settings, Settings, Package, FileText, Package];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  const page = dict.servicePages?.oem || oemPage;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/${locale}${oemPage.path}`,
      languages: localizedAlternates(oemPage.path),
    },
    openGraph: {
      type: 'website',
      siteName,
      url: `/${locale}${oemPage.path}`,
      title: page.metaTitle,
      description: page.metaDescription,
    },
    twitter: {
      card: 'summary',
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function OemOdmPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  const page = dict.servicePages?.oem || oemPage;
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.metaDescription,
    url: absoluteUrl(`/${locale}${oemPage.path}`),
    provider: {
      '@type': 'Organization',
      name: siteName,
    },
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: dict.brandPage?.breadcrumb?.home || 'Home', url: absoluteUrl(`/${locale}`) },
    { name: page.eyebrow, url: absoluteUrl(`/${locale}${oemPage.path}`) },
  ]);

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />

      <section className="relative overflow-hidden bg-[#062748]">
        <div className="absolute inset-0 tech-grid" />
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-[2px] bg-[#FF8A1F]" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                  {page.eyebrow}
                </span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-[#F7FBFF] leading-tight mb-5" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {page.title}
              </h1>
              <p className="text-[#C7D7E8] leading-relaxed max-w-2xl">{page.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LeadModalTrigger
                  prefillType="oem"
                  className="btn-glow inline-flex items-center justify-center rounded-lg bg-[#FF8A1F] px-6 py-3 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
                >
                  {page.primaryCta}
                </LeadModalTrigger>
                <Link href={`/${locale}/request-catalog`} className="inline-flex items-center gap-2 rounded-lg border border-[#2A587C] px-6 py-3 text-sm font-semibold text-[#C7D7E8] transition-colors hover:border-[#FF8A1F]/50 hover:text-[#F7FBFF]">
                  {page.secondaryCta} <ArrowRight className="w-4 h-4 text-[#FF8A1F]" />
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-[#123D63] bg-[#08345F]">
              <div className="relative aspect-[16/10]">
                <Image src="/images/factory-rd.webp" alt="RF engineering and development workspace" fill className="object-cover opacity-85" priority />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#062748]/70 via-[#062748]/20 to-[#FF8A1F]/10" />
              </div>
              <div className="grid grid-cols-3 border-t border-[#123D63] text-center">
                {['RF Match', 'Sample Test', 'Private Label'].map((item) => (
                  <div key={item} className="border-r border-[#123D63] px-3 py-4 last:border-r-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFB15C]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                {page.supportTitle}
              </p>
              <h2 className="mt-3 text-2xl lg:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {page.supportHeading}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#64748B]">{page.supportSubtitle}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {page.highlights.map((item: string) => (
                <div key={item} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <p className="text-sm font-semibold leading-relaxed text-[#153A5C]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
            {page.workflowLabel}
          </p>
          <h2 className="mt-3 text-2xl lg:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            {page.detailTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{page.detailSubtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {oemSteps.map((step, index) => {
            const Icon = iconMap[index] || Settings;
            return (
              <div key={step.step} className="rounded-lg border border-[#E2E8F0] bg-white p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF8A1F]/10 text-[#FF8A1F]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#94A3B8]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                    0{step.step}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#64748B]">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
