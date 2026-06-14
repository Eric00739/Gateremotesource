export { I18nProvider, useI18n, useLocale, useDict } from './I18nProvider';

export const locales = ['en', 'it', 'pt', 'es', 'ru', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'EN',
  it: 'IT',
  pt: 'PT',
  es: 'ES',
  ru: 'РУ',
  fr: 'FR',
};

export const defaultLocale: Locale = 'en';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dict = Record<string, any>;

export async function getDict(locale: Locale): Promise<Dict> {
  switch (locale) {
    case 'en': return import('./en').then(m => m.default);
    case 'it': return import('./it').then(m => m.default);
    case 'pt': return import('./pt').then(m => m.default);
    case 'es': return import('./es').then(m => m.default);
    case 'ru': return import('./ru').then(m => m.default);
    case 'fr': return import('./fr').then(m => m.default);
    default: return import('./en').then(m => m.default);
  }
}
