import type { Metadata } from 'next';
import LegacyEnglishShell from '@/components/LegacyEnglishShell';
import RequestCatalogPage from '@/app/[locale]/request-catalog/page';
import { catalogPage } from '@/data/servicePages';

export const metadata: Metadata = {
  title: catalogPage.metaTitle,
  description: catalogPage.metaDescription,
  robots: { index: false, follow: true },
  alternates: { canonical: `/en${catalogPage.path}` },
};

export default async function LegacyRequestCatalogPage() {
  return (
    <LegacyEnglishShell>
      {await RequestCatalogPage({ params: Promise.resolve({ locale: 'en' }) })}
    </LegacyEnglishShell>
  );
}
