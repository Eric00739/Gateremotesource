import type { Metadata } from 'next';
import LegacyEnglishShell from '@/components/LegacyEnglishShell';
import FactoryQualityPage from '@/app/[locale]/factory-quality/page';
import { factoryQualityPage } from '@/data/servicePages';

export const metadata: Metadata = {
  title: factoryQualityPage.metaTitle,
  description: factoryQualityPage.metaDescription,
  robots: { index: false, follow: true },
  alternates: { canonical: `/en${factoryQualityPage.path}` },
};

export default async function LegacyFactoryQualityPage() {
  return (
    <LegacyEnglishShell>
      {await FactoryQualityPage({ params: Promise.resolve({ locale: 'en' }) })}
    </LegacyEnglishShell>
  );
}
