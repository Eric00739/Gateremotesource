'use client';

import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LeadModalTrigger from './LeadModalTrigger';
import { useDict, useLocale, locales, localeNames, type Locale } from '@/i18n';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dict = useDict();
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const modelDetailsLabel = dict.header.modelDetails || dict.hero.modelDetailsCta || 'Send Model Details';
  const factoryQualityLabel = dict.header.factoryQuality || `${dict.header.factory} & Quality`;

  const navItems = [
    { label: dict.header.compatibility, href: `/${currentLocale}/compatibility` },
    { label: dict.header.oemOdm, href: `/${currentLocale}/oem-odm` },
    { label: factoryQualityLabel, href: `/${currentLocale}/factory-quality` },
    { label: dict.header.blog, href: `/${currentLocale}/blog` },
  ];

  const switchLocale = (locale: Locale) => {
    const localePattern = /^\/[a-z]{2}(?=\/|$)/;
    const pathWithoutLocale = pathname.replace(localePattern, '') || '/';
    const nextPath = pathWithoutLocale === '/' ? `/${locale}` : `/${locale}${pathWithoutLocale}`;
    router.push(nextPath);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#D8E4F0] shadow-sm shadow-[#062748]/5">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#0B3A63] rounded-md flex items-center justify-center relative overflow-hidden group-hover:bg-[#062748] transition-colors duration-300">
              <span className="text-white font-bold text-sm tracking-tight relative z-10" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>GR</span>
            </div>
            <div className="hidden sm:block">
              <div className="leading-tight">
                <span className="text-[#0B2745] font-extrabold text-lg tracking-tight" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>Gate</span>
                <span className="text-[#FF8A1F] font-extrabold text-lg tracking-tight" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>Remote</span>
                <span className="text-[#0B2745] font-extrabold text-lg tracking-tight" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>Source</span>
              </div>
              <p className="text-[8px] text-[#6B7F96] tracking-[0.2em] uppercase -mt-0.5" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                {dict.header.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[12px] text-[#153A5C] hover:text-[#FF8A1F] transition-colors font-semibold tracking-wide px-3 py-2 rounded-lg hover:bg-[#FF8A1F]/8 relative group"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
            <LeadModalTrigger
              prefillType="support"
              className="text-[12px] text-[#153A5C] hover:text-[#FF8A1F] transition-colors font-semibold tracking-wide px-3 py-2 rounded-lg hover:bg-[#FF8A1F]/8 cursor-pointer"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              {dict.header.contact}
            </LeadModalTrigger>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-[10px] text-[#6B7F96] border border-[#D8E4F0] rounded-md px-2 py-1 font-medium hover:border-[#FF8A1F]/50 hover:text-[#FF8A1F] transition-colors"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                <Globe className="w-3 h-3" />
                {localeNames[currentLocale]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 z-50 min-w-[80px]">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      type="button"
                      onClick={() => { switchLocale(locale); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                        locale === currentLocale
                          ? 'bg-[#FF8A1F]/10 text-[#FF8A1F]'
                          : 'text-[#64748B] hover:bg-[#F8FAFC]'
                      }`}
                      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                    >
                      {localeNames[locale]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="https://wa.me/8615899648898"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22C55E] hover:text-[#16A34A] transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <LeadModalTrigger
              prefillType="compatibility"
              className="bg-[#FF8A1F] hover:bg-[#F97316] text-[#062748] text-[12px] font-bold px-5 py-2 rounded-lg transition-all btn-glow shadow-sm shadow-orange-500/20"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              {modelDetailsLabel}
            </LeadModalTrigger>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-[#153A5C]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden py-4 border-t border-[#D8E4F0] bg-white">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-[#153A5C] hover:text-[#FF8A1F] font-semibold py-2 px-3 rounded-lg hover:bg-[#FF8A1F]/8"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <LeadModalTrigger
                prefillType="support"
                className="text-sm text-[#153A5C] hover:text-[#FF8A1F] font-semibold py-2 px-3 rounded-lg hover:bg-[#FF8A1F]/8 cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                {dict.header.contact}
              </LeadModalTrigger>
              {/* Mobile Language Switcher */}
              <div className="flex flex-wrap gap-1 px-3 py-1">
                {locales.map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    onClick={() => { switchLocale(locale); setMobileOpen(false); }}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      locale === currentLocale
                        ? 'bg-[#FF8A1F] text-[#062748]'
                        : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#EFF6FF]'
                    }`}
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    {localeNames[locale]}
                  </button>
                ))}
              </div>
              <LeadModalTrigger
                prefillType="compatibility"
                className="bg-[#FF8A1F] hover:bg-[#F97316] text-[#062748] text-sm font-bold py-2.5 px-5 rounded-lg text-center mt-1"
                onClick={() => setMobileOpen(false)}
              >
                {modelDetailsLabel}
              </LeadModalTrigger>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
