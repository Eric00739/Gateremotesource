import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import LeadModalProvider from '@/components/LeadModalProvider';
import LeadModalTrigger from '@/components/LeadModalTrigger';
import { compatibilityBrands, getCompatibilityBrand } from '@/data/compatibility';
import { type Locale, locales } from '@/i18n';
import { getDictSync } from '@/i18n/dictionaries';
import { siteName } from '@/data/site';
import { absoluteUrl, breadcrumbJsonLd, jsonLd, localizedAlternates } from '@/lib/seo';

export async function generateStaticParams() {
  return compatibilityBrands.map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string; locale: string }> }): Promise<Metadata> {
  return (async () => {
    const { brand: slug, locale: rawLocale } = await params;
    const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
    const dict = getDictSync(locale);
    const brand = getCompatibilityBrand(slug);

    if (!brand) {
      return { title: 'Compatibility Page Not Found' };
    }

    const title = `${brand.name} ${dict.brandPage.referenceTitle} | GateRemoteSource`;
    const description = `${brand.shortDescription} Wholesale matching, sample verification, and OEM packaging support.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/compatibility/${brand.slug}`,
        languages: localizedAlternates(`/compatibility/${brand.slug}`),
      },
      openGraph: {
        type: 'article',
        siteName,
        url: `/${locale}/compatibility/${brand.slug}`,
        title,
        description,
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  })();
}

export default async function BrandCompatibilityPage({
  params,
}: {
  params: Promise<{ brand: string; locale: string }>;
}) {
  const { brand: slug, locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  const brand = getCompatibilityBrand(slug);

  if (!brand) notFound();

  const relatedBrands = compatibilityBrands.filter((item) => item.slug !== brand.slug).slice(0, 5);
  const faqItems = [
    {
      question: `${dict.brandPage.faqTitle} ${brand.name}?`,
      answer: `Compatibility is not confirmed by brand name alone. ${brand.name} matching should be checked by model, frequency, receiver version, chip, coding protocol, and regional version.`,
    },
    {
      question: `${dict.brandPage.sendDetails} ${brand.name}?`,
      answer: `Send front and back photos of the original remote, the model or frequency label, receiver or opener label, button count, and target country or market version.`,
    },
    {
      question: `${brand.name} OEM packaging?`,
      answer: 'OEM logo, private-label shell options, and packaging support can be discussed after the matching reference and sample requirements are confirmed.',
    },
  ];

  const breadcrumbJsonLdData = breadcrumbJsonLd([
    { name: dict.brandPage.breadcrumb.home, url: absoluteUrl(`/${locale}`) },
    { name: dict.brandPage.breadcrumb.compatibility, url: absoluteUrl(`/${locale}/compatibility`) },
    { name: brand.name, url: absoluteUrl(`/${locale}/compatibility/${brand.slug}`) },
  ]);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <LeadModalProvider>
      <div className="bg-[#F8FAFC] text-[#0F172A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLdData)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd)} />

      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${locale}/compatibility`} className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] transition-colors hover:text-[#FF8A1F]">
            <ArrowLeft className="w-4 h-4" /> {dict.brandPage.backLink}
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden bg-[#062748]">
        <div className="absolute inset-0 tech-grid" />
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
              {dict.brandPage.title}
            </p>
            <h1 className="mt-4 text-3xl lg:text-5xl font-bold leading-tight text-[#F7FBFF]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {brand.name} {dict.brandPage.referenceTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-[#C7D7E8] leading-relaxed">
              {brand.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LeadModalTrigger
                prefillType="compatibility"
                className="btn-glow inline-flex items-center justify-center rounded-lg bg-[#FF8A1F] px-6 py-3 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
              >
                {dict.compatibility.cta} {brand.name}
              </LeadModalTrigger>
              <Link href={`/${locale}/blog/why-universal-remote-cannot-copy`} className="inline-flex items-center gap-2 rounded-lg border border-[#2A587C] px-6 py-3 text-sm font-semibold text-[#C7D7E8] transition-colors hover:border-[#FF8A1F]/50 hover:text-[#F7FBFF]">
                {dict.compatibility.checklistLabel} <ArrowRight className="w-4 h-4 text-[#FF8A1F]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                {dict.brandPage.referenceTitle}
              </p>
              <h2 className="mt-3 text-2xl lg:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {dict.brandPage.buyerRequests}
              </h2>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
              <div className="hidden bg-[#F1F5F9] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748B] sm:grid sm:grid-cols-[1fr_0.85fr_0.9fr_1.3fr] sm:gap-4" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                <span>{dict.brandPage.modelRef}</span>
                <span>{dict.brandPage.frequencyRef}</span>
                <span>{dict.brandPage.codeTypeRef}</span>
                <span>{dict.brandPage.matchingNote}</span>
              </div>
              {brand.models.map((model) => (
                <div key={model.model} className="grid gap-3 border-t border-[#E2E8F0] px-5 py-4 text-sm sm:grid-cols-[1fr_0.85fr_0.9fr_1.3fr] sm:gap-4 sm:first:border-t-0">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] sm:hidden" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>{dict.brandPage.modelRef}</p>
                    <p className="font-bold text-[#0F172A]">{model.model}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] sm:hidden" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>{dict.brandPage.frequencyRef}</p>
                    <p className="text-[#153A5C]">{model.frequency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] sm:hidden" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>{dict.brandPage.codeTypeRef}</p>
                    <p className="text-[#153A5C]">{model.codeType}</p>
                  </div>
                  <p className="text-[#64748B]">{model.note}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-[#E2E8F0] bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
              {dict.brandPage.checklist}
            </p>
            <h2 className="mt-3 text-xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {dict.brandPage.sendDetails}
            </h2>
            <div className="mt-5 space-y-3">
              {brand.checks.map((check) => (
                <div key={check} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8A1F]" />
                  <p className="text-sm leading-relaxed text-[#64748B]">{check}</p>
                </div>
              ))}
            </div>
            <LeadModalTrigger
              prefillType="compatibility"
              className="btn-glow mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#FF8A1F] px-5 py-3 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
            >
              {dict.brandPage.checklist} {brand.name}
            </LeadModalTrigger>
          </aside>
        </div>
      </section>

      <section className="bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {dict.brandPage.importantNote}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#64748B]">
                {brand.name} {dict.brandPage.importantNote}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {['Sample testing before bulk order', 'OEM logo and packaging options', 'Receiver and frequency confirmation', 'Wholesale sourcing support'].map((item) => (
                <div key={item} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-sm font-semibold text-[#153A5C]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
              {dict.brandPage.faqTitle}
            </p>
            <h2 className="mt-3 text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {brand.name} {dict.brandPage.faqHeading}
            </h2>
          </div>
          <div className="divide-y divide-[#E2E8F0] rounded-lg border border-[#E2E8F0] bg-white">
            {faqItems.map((item) => (
              <div key={item.question} className="p-5">
                <h3 className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
              {dict.brandPage.morePages}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedBrands.map((item) => (
                <Link key={item.slug} href={`/${locale}/compatibility/${item.slug}`} className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#153A5C] transition-colors hover:border-[#FF8A1F]/40 hover:text-[#FF8A1F]">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href={`/${locale}/compatibility`} className="inline-flex items-center gap-2 text-sm font-bold text-[#FF8A1F] transition-colors hover:text-[#F97316]">
            {dict.compatibilityTable.viewAll} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
    </LeadModalProvider>
  );
}
