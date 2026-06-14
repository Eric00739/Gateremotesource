import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Camera, Cpu, Radio, ShieldCheck } from 'lucide-react';
import LeadModalProvider from '@/components/LeadModalProvider';
import LeadModalTrigger from '@/components/LeadModalTrigger';
import { compatibilityBrands } from '@/data/compatibility';
import { type Locale, locales } from '@/i18n';
import { getDictSync } from '@/i18n/dictionaries';
import { siteName } from '@/data/site';
import { absoluteUrl, breadcrumbJsonLd, jsonLd, localizedAlternates } from '@/lib/seo';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return (async () => {
    const { locale: rawLocale } = await params;
    const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
    const dict = getDictSync(locale);
    const title = `${dict.compatibility.title} | GateRemoteSource`;
    return {
      title,
      description: dict.compatibility.subtitle,
      alternates: {
        canonical: `/${locale}/compatibility`,
        languages: localizedAlternates('/compatibility'),
      },
      openGraph: {
        type: 'website',
        siteName,
        url: `/${locale}/compatibility`,
        title,
        description: dict.compatibility.subtitle,
      },
      twitter: {
        card: 'summary',
        title,
        description: dict.compatibility.subtitle,
      },
    };
  })();
}

const splitBuyerIntent = (intent: string) => intent.split(',').map((item) => item.trim()).filter(Boolean);

export default async function CompatibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: dict.compatibility.title,
    description: dict.compatibility.subtitle,
    url: absoluteUrl(`/${locale}/compatibility`),
    inLanguage: locale,
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: absoluteUrl(`/${locale}`) },
    { name: dict.compatibility.title, url: absoluteUrl(`/${locale}/compatibility`) },
  ]);

  return (
    <LeadModalProvider>
      <div className="bg-[#F8FAFC] text-[#0F172A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collectionJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <section className="relative overflow-hidden bg-[#062748]">
        <div className="absolute inset-0 tech-grid" />
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-[2px] bg-[#FF8A1F]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
              {dict.compatibility.sectionLabel}
            </span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-5xl font-bold text-[#F7FBFF] leading-tight mb-5" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {dict.compatibility.title}
            </h1>
            <p className="text-[#C7D7E8] leading-relaxed max-w-2xl">
              {dict.compatibility.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LeadModalTrigger
                prefillType="compatibility"
                className="btn-glow inline-flex items-center justify-center rounded-lg bg-[#FF8A1F] px-6 py-3 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
              >
                {dict.compatibility.cta}
              </LeadModalTrigger>
              <Link href={`/${locale}/blog/why-universal-remote-cannot-copy`} className="inline-flex items-center gap-2 rounded-lg border border-[#2A587C] px-6 py-3 text-sm font-semibold text-[#C7D7E8] transition-colors hover:border-[#FF8A1F]/50 hover:text-[#F7FBFF]">
                {dict.compatibility.checklistLabel} <ArrowRight className="w-4 h-4 text-[#FF8A1F]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            {dict.compatibility.browseLabel}
          </h2>
          <p className="text-sm leading-relaxed text-[#64748B]">
            {dict.compatibilityTable.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {compatibilityBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/${locale}/compatibility/${brand.slug}`}
              className="group block rounded-lg border border-[#E2E8F0] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#FF8A1F]/35 hover:shadow-lg hover:shadow-slate-200/70"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                    {dict.compatibilityTable.brandHeader}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {brand.name}
                  </h3>
                </div>
                <ArrowRight className="w-4 h-4 text-[#94A3B8] transition-transform group-hover:translate-x-1 group-hover:text-[#FF8A1F]" />
              </div>
              <p className="text-sm leading-relaxed text-[#64748B]">{brand.shortDescription}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {splitBuyerIntent(brand.buyerIntent).map((item) => (
                  <span key={item} className="rounded-md bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-[#64748B]">
                    {item}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                {dict.compatibility.verificationTitle}
              </p>
              <h2 className="mt-3 text-2xl lg:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {dict.compatibility.verificationSubtitle}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {(dict.compatibility.verificationItems as { title: string; description: string }[]).map((item) => (
                <div key={item.title} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  {item.title === 'Original Remote Photos' && <Camera className="mb-4 h-5 w-5 text-[#FF8A1F]" />}
                  {item.title === 'Frequency Information' && <Radio className="mb-4 h-5 w-5 text-[#FF8A1F]" />}
                  {item.title === 'Receiver or Motor Label' && <ShieldCheck className="mb-4 h-5 w-5 text-[#FF8A1F]" />}
                  {item.title === 'Target Market' && <Cpu className="mb-4 h-5 w-5 text-[#FF8A1F]" />}
                  <h3 className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#64748B]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg bg-[#062748] p-6 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#F7FBFF]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {dict.compatibility.needModelChecked}
              </h2>
              <p className="mt-2 text-sm text-[#C7D7E8]">
                {dict.compatibilityTable.noMatch}
              </p>
            </div>
            <LeadModalTrigger
              prefillType="compatibility"
              className="btn-glow inline-flex shrink-0 items-center justify-center rounded-lg bg-[#FF8A1F] px-6 py-3 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
            >
              {dict.compatibility.sendModelDetails}
            </LeadModalTrigger>
          </div>
        </div>
      </section>
    </div>
    </LeadModalProvider>
  );
}
