import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera, Globe2, ListChecks, PackageSearch } from 'lucide-react';
import LeadModalTrigger from '@/components/LeadModalTrigger';
import { catalogPage } from '@/data/servicePages';
import { type Locale, locales } from '@/i18n';
import { getDictSync } from '@/i18n/dictionaries';
import { siteName } from '@/data/site';
import { absoluteUrl, breadcrumbJsonLd, jsonLd, localizedAlternates } from '@/lib/seo';

const requirementIcons = [Camera, PackageSearch, Globe2, ListChecks];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  const page = dict.servicePages?.catalog || catalogPage;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/${locale}${catalogPage.path}`,
      languages: localizedAlternates(catalogPage.path),
    },
    openGraph: {
      type: 'website',
      siteName,
      url: `/${locale}${catalogPage.path}`,
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

export default async function RequestCatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  const page = dict.servicePages?.catalog || catalogPage;
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: page.title,
    description: page.metaDescription,
    url: absoluteUrl(`/${locale}${catalogPage.path}`),
    inLanguage: locale,
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: dict.brandPage?.breadcrumb?.home || 'Home', url: absoluteUrl(`/${locale}`) },
    { name: page.eyebrow, url: absoluteUrl(`/${locale}${catalogPage.path}`) },
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
                  prefillType="compatibility"
                  className="btn-glow inline-flex items-center justify-center rounded-lg bg-[#FF8A1F] px-6 py-3 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
                >
                  {page.primaryCta}
                </LeadModalTrigger>
                <Link href={`/${locale}/compatibility`} className="inline-flex items-center gap-2 rounded-lg border border-[#2A587C] px-6 py-3 text-sm font-semibold text-[#C7D7E8] transition-colors hover:border-[#FF8A1F]/50 hover:text-[#F7FBFF]">
                  {page.secondaryCta} <ArrowRight className="w-4 h-4 text-[#FF8A1F]" />
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-[#123D63] bg-[#08345F]">
              <div className="relative aspect-[16/10]">
                <Image src="/images/factory-packaging.webp" alt="Packaging inspection for wholesale catalog request" fill className="object-cover opacity-85" priority />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#062748]/75 via-[#062748]/20 to-[#FF8A1F]/10" />
              </div>
              <div className="border-t border-[#123D63] px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFB15C]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                  {page.cardNote}
                </p>
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
                {page.requirementTitle}
              </p>
              <h2 className="mt-3 text-2xl lg:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {page.requirementHeading}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#64748B]">{page.requirementSubtitle}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {page.requirements.map((item: { title: string; description: string }, index: number) => {
                const Icon = requirementIcons[index] || ListChecks;
                return (
                  <div key={item.title} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                    <Icon className="mb-4 h-5 w-5 text-[#FF8A1F]" />
                    <h3 className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#64748B]">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="rounded-lg bg-[#062748] p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                {page.scopeLabel}
              </p>
              <h2 className="mt-3 text-2xl lg:text-3xl font-bold text-[#F7FBFF]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {page.scopeTitle}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {page.scopeItems.map((item: string) => (
                <div key={item} className="rounded-lg border border-[#123D63] bg-[#08345F] px-4 py-3">
                  <p className="text-sm font-semibold text-[#C7D7E8]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
