import type { Metadata } from 'next';
import LegacyEnglishShell from '@/components/LegacyEnglishShell';
import BrandCompatibilityPage from '@/app/[locale]/compatibility/[brand]/page';
import { compatibilityBrands, getCompatibilityBrand } from '@/data/compatibility';

export function generateStaticParams() {
  return compatibilityBrands.map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const brandData = getCompatibilityBrand(brand);
  return {
    title: brandData ? `${brandData.name} Matching References | GateRemoteSource` : 'Compatibility References | GateRemoteSource',
    robots: { index: false, follow: true },
    alternates: { canonical: `/en/compatibility/${brand}` },
  };
}

export default async function LegacyBrandCompatibilityPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  return (
    <LegacyEnglishShell>
      {await BrandCompatibilityPage({ params: Promise.resolve({ brand, locale: 'en' }) })}
    </LegacyEnglishShell>
  );
}
