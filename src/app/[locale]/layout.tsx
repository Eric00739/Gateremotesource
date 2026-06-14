import { I18nProvider, locales, type Locale } from '@/i18n';
import { getDictSync } from '@/i18n/dictionaries';
import { siteName } from '@/data/site';
import type { Metadata } from 'next';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadModalProvider from '@/components/LeadModalProvider';
import { defaultOgImage, jsonLd, localizedAlternates, organizationJsonLd, websiteJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: localizedAlternates(''),
    },
    openGraph: {
      type: 'website',
      siteName,
      url: `/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      images: [defaultOgImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: [defaultOgImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);

  return (
    <I18nProvider locale={locale} dict={dict}>
      <LeadModalProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd())} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteJsonLd(locale))} />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </LeadModalProvider>
    </I18nProvider>
  );
}
