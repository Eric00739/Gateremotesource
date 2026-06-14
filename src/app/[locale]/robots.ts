import type { MetadataRoute } from 'next';
import { siteUrl } from '@/data/site';
import { locales } from '@/i18n';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: locales.map((locale) =>
      new URL(`/${locale}/sitemap.xml`, siteUrl).toString()
    ),
  };
}
