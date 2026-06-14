'use client';

import Link from 'next/link';
import LeadModalTrigger from './LeadModalTrigger';
import { useDict, useLocale } from '@/i18n';

const compatibilityBrands = [
  { label: 'FAAC', href: '/compatibility/faac' },
  { label: 'Nice', href: '/compatibility/nice' },
  { label: 'BFT', href: '/compatibility/bft' },
  { label: 'DoorHan', href: '/compatibility/doorhan' },
  { label: 'CAME', href: '/compatibility/came' },
  { label: 'LiftMaster', href: '/compatibility/liftmaster' },
];

export default function Footer() {
  const dict = useDict();
  const locale = useLocale();
  const factoryQualityLabel = dict.header.factoryQuality || `${dict.header.factory} & Quality`;
  const requestCatalogLabel = dict.footer.requestCatalog || 'Request Catalog';

  const exploreLinks = [
    { label: dict.footer.compatibility, href: `/${locale}/compatibility` },
    { label: dict.header.oemOdm, href: `/${locale}/oem-odm` },
    { label: factoryQualityLabel, href: `/${locale}/factory-quality` },
    { label: requestCatalogLabel, href: `/${locale}/request-catalog` },
    { label: dict.footer.resources, href: `/${locale}/blog` },
  ];

  return (
    <footer id="contact" className="bg-[#062748] text-[#F7FBFF] border-t border-[#123D63]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid gap-9 lg:grid-cols-[1.45fr_0.7fr_0.9fr] lg:items-start">
          {/* Brand */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#FF8A1F] rounded-lg flex items-center justify-center">
                <span className="text-[#062748] font-bold text-sm" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                  GR
                </span>
              </div>
              <div className="leading-tight">
                <span className="text-[#F7FBFF] font-bold text-lg" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                  Gate
                </span>
                <span className="text-[#FF8A1F] font-bold text-lg" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                  Remote
                </span>
                <span className="text-[#F7FBFF] font-bold text-lg" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                  Source
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#C7D7E8] max-w-md">
              {dict.footer.description}
            </p>

            <div className="mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF8A1F]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                {dict.footer.compatibilityReferences}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {compatibilityBrands.map((brand) => (
                  <Link key={brand.href} href={`/${locale}${brand.href}`} className="rounded-md border border-[#123D63] px-2.5 py-1 text-xs text-[#C7D7E8] transition-colors hover:border-[#FF8A1F]/50 hover:text-[#FF8A1F]">
                    {brand.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-[#F7FBFF] mb-4" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {dict.footer.company}
            </h4>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-2 lg:grid-cols-1">
              {exploreLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-[#C7D7E8] hover:text-[#FF8A1F] transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[#F7FBFF] mb-4" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {dict.footer.sendModelList}
            </h4>
            <div className="space-y-2 text-sm text-[#C7D7E8]">
              <a href="mailto:sales@gateremotesource.com" className="block hover:text-[#FF8A1F] transition-colors">
                sales@gateremotesource.com
              </a>
              <a href="https://wa.me/8615899648898" target="_blank" rel="noopener noreferrer" className="block hover:text-[#FF8A1F] transition-colors">
                WhatsApp: +86 158 9964 8898
              </a>
              <p className="text-xs leading-relaxed text-[#7F9AB7]">
                Dongguan, Guangdong, China
              </p>
            </div>
            <LeadModalTrigger
              prefillType="compatibility"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#FF8A1F] px-5 py-2.5 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316] btn-glow"
            >
              {dict.hero.modelDetailsCta || dict.leadModal.title}
            </LeadModalTrigger>
          </div>
        </div>

        <div className="mt-9 border-t border-[#123D63] pt-5 flex flex-col gap-3 text-xs text-[#7F9AB7] sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl leading-relaxed">
            {dict.footer.disclaimer}
          </p>
          <p className="shrink-0">
            &copy; {new Date().getFullYear()} GateRemoteSource. {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
