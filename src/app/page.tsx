import type { Metadata } from 'next';
import LocaleLayout from '@/app/[locale]/layout';
import HomePage from '@/app/[locale]/page';
import { getDictSync } from '@/i18n/dictionaries';
import { siteName } from '@/data/site';
import { defaultOgImage, localizedAlternates } from '@/lib/seo';

const dict = getDictSync('en');

export const metadata: Metadata = {
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: {
    canonical: '/en',
    languages: localizedAlternates(''),
  },
  openGraph: {
    type: 'website',
    siteName,
    url: '/en',
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

export default function RootPage() {
  return (
    <LocaleLayout params={Promise.resolve({ locale: 'en' })}>
      <HomePage />
    </LocaleLayout>
  );
}
