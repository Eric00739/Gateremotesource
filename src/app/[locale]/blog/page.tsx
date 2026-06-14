import type { Metadata } from 'next';
import BlogIndexClient from '@/components/BlogIndexClient';
import LeadModalProvider from '@/components/LeadModalProvider';
import { type Locale, locales } from '@/i18n';
import { getDictSync } from '@/i18n/dictionaries';
import { siteName } from '@/data/site';
import { absoluteUrl, breadcrumbJsonLd, jsonLd, localizedAlternates } from '@/lib/seo';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';
  const dict = getDictSync(locale);
  const title = `${dict.blog.title} | GateRemoteSource`;
  return {
    title,
    description: dict.blog.subtitle,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: localizedAlternates('/blog'),
    },
    openGraph: {
      type: 'website',
      siteName,
      url: `/${locale}/blog`,
      title,
      description: dict.blog.subtitle,
    },
    twitter: {
      card: 'summary',
      title,
      description: dict.blog.subtitle,
    },
  };
}

async function BlogPageContent({ locale }: { locale: Locale }) {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog & Compatibility Guides',
    description: getDictSync(locale).blog.subtitle,
    url: absoluteUrl(`/${locale}/blog`),
    inLanguage: locale,
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: absoluteUrl(`/${locale}`) },
    { name: 'Blog', url: absoluteUrl(`/${locale}/blog`) },
  ]);

  return (
    <LeadModalProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(blogJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <BlogIndexClient />
    </LeadModalProvider>
  );
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? rawLocale as Locale : 'en';

  return <BlogPageContent locale={locale} />;
}
