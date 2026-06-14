import type { Metadata } from 'next';
import LegacyEnglishShell from '@/components/LegacyEnglishShell';
import OemOdmPage from '@/app/[locale]/oem-odm/page';
import { oemPage } from '@/data/servicePages';

export const metadata: Metadata = {
  title: oemPage.metaTitle,
  description: oemPage.metaDescription,
  robots: { index: false, follow: true },
  alternates: { canonical: `/en${oemPage.path}` },
};

export default async function LegacyOemOdmPage() {
  return (
    <LegacyEnglishShell>
      {await OemOdmPage({ params: Promise.resolve({ locale: 'en' }) })}
    </LegacyEnglishShell>
  );
}
