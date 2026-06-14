import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FlaskConical, PackageCheck, RadioTower, ShieldCheck } from 'lucide-react';
import LeadModalTrigger from '@/components/LeadModalTrigger';
import { factoryItems } from '@/data/homepage';
import { factoryQualityPage } from '@/data/servicePages';
import { type Locale, locales } from '@/i18n';
import { getDictSync } from '@/i18n/dictionaries';
import { siteName } from '@/data/site';
import { absoluteUrl, breadcrumbJsonLd, jsonLd, localizedAlternates } from '@/lib/seo';

const checkIcons = [ShieldCheck, RadioTower, FlaskConical, PackageCheck, CheckCircle2, CheckCircle2];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  const page = dict.servicePages?.factoryQuality || factoryQualityPage;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/${locale}${factoryQualityPage.path}`,
      languages: localizedAlternates(factoryQualityPage.path),
    },
    openGraph: {
      type: 'website',
      siteName,
      url: `/${locale}${factoryQualityPage.path}`,
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

export default async function FactoryQualityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  const page = dict.servicePages?.factoryQuality || factoryQualityPage;
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: page.title,
    description: page.metaDescription,
    url: absoluteUrl(`/${locale}${factoryQualityPage.path}`),
    inLanguage: locale,
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: dict.brandPage?.breadcrumb?.home || 'Home', url: absoluteUrl(`/${locale}`) },
    { name: page.eyebrow, url: absoluteUrl(`/${locale}${factoryQualityPage.path}`) },
  ]);

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />

      <section className="relative overflow-hidden bg-[#062748]">
        <div className="absolute inset-0 tech-grid" />
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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
                <Link href={`/${locale}/request-catalog`} className="inline-flex items-center gap-2 rounded-lg border border-[#2A587C] px-6 py-3 text-sm font-semibold text-[#C7D7E8] transition-colors hover:border-[#FF8A1F]/50 hover:text-[#F7FBFF]">
                  {page.secondaryCta} <ArrowRight className="w-4 h-4 text-[#FF8A1F]" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {factoryItems.slice(0, 4).map((item) => (
                <div key={item.name} className="relative h-40 overflow-hidden rounded-lg border border-[#123D63] bg-[#08345F] sm:h-48">
                  <Image src={item.image} alt={item.name} fill priority className="object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062748]/80 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-xs font-bold text-[#F7FBFF]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {item.name}
                  </p>
                </div>
              ))}
              </div>
            </div>
          </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                {page.processLabel}
              </p>
              <h2 className="mt-3 text-2xl lg:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {page.processTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#64748B]">{page.processSubtitle}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {page.checks.map((check: string, index: number) => {
                const Icon = checkIcons[index] || CheckCircle2;
                return (
                  <div key={check} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                    <Icon className="mb-4 h-5 w-5 text-[#FF8A1F]" />
                    <p className="text-sm font-semibold text-[#153A5C]">{check}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
            {page.facilityLabel}
          </p>
          <h2 className="mt-3 text-2xl lg:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            {page.facilityTitle}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {factoryItems.slice(4).map((item) => (
            <div key={item.name} className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
              <div className="relative h-36">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <p className="px-4 py-3 text-center text-xs font-semibold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
