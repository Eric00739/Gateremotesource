import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { compatibilityBrands } from '@/data/compatibility';
import { catalogPage, factoryQualityPage, oemPage } from '@/data/servicePages';
import { defaultLocale, locales } from '@/i18n';
import { absoluteUrl, localizedAlternates, postLastModified, siteUpdatedAt } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(siteUpdatedAt);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(`/${locale}`),
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: localizedAlternates('') },
    });

    entries.push({
      url: absoluteUrl(`/${locale}/compatibility`),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: localizedAlternates('/compatibility') },
    });

    for (const page of [oemPage, factoryQualityPage, catalogPage]) {
      entries.push({
        url: absoluteUrl(`/${locale}${page.path}`),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: { languages: localizedAlternates(page.path) },
      });
    }

    for (const brand of compatibilityBrands) {
      entries.push({
        url: absoluteUrl(`/${locale}/compatibility/${brand.slug}`),
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: { languages: localizedAlternates(`/compatibility/${brand.slug}`) },
      });
    }

    entries.push({
      url: absoluteUrl(`/${locale}/blog`),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: localizedAlternates('/blog') },
    });
  }

  for (const post of blogPosts) {
    entries.push({
      url: absoluteUrl(`/${defaultLocale}/blog/${post.slug}`),
      lastModified: postLastModified(post),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: post.image ? [absoluteUrl(post.image)] : undefined,
    });
  }

  return entries;
}
