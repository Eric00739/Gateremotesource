import type { Metadata } from 'next';
import LegacyEnglishShell from '@/components/LegacyEnglishShell';
import CompatibilityPage from '@/app/[locale]/compatibility/page';

export const metadata: Metadata = {
  title: 'Compatible Replacement Remote Guides | GateRemoteSource',
  robots: { index: false, follow: true },
  alternates: { canonical: '/en/compatibility' },
};

export default async function LegacyCompatibilityPage() {
  return (
    <LegacyEnglishShell>
      {await CompatibilityPage({ params: Promise.resolve({ locale: 'en' }) })}
    </LegacyEnglishShell>
  );
}
