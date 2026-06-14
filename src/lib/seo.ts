import type { BlogPost, BlogPostContentBlock } from '@/data/blog';
import { siteName, siteUrl } from '@/data/site';
import { defaultLocale, locales, type Locale } from '@/i18n';

export const siteUpdatedAt = '2026-05-02';
export const defaultOgImage = '/images/hero-products.png';
export const organizationLogo = '/favicon.ico';

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function localizedAlternates(path = '') {
  const normalizedPath = path === '/' ? '' : path;

  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, absoluteUrl(`/${locale}${normalizedPath}`)]),
    ),
    'x-default': absoluteUrl(`/${defaultLocale}${normalizedPath}`),
  };
}

export function toIsoDate(date?: string) {
  const value = date || siteUpdatedAt;
  const parsed = new Date(value.includes('T') ? value : `${value}T00:00:00.000Z`);

  return Number.isNaN(parsed.getTime()) ? new Date(siteUpdatedAt).toISOString() : parsed.toISOString();
}

export function postLastModified(post: BlogPost) {
  return new Date(toIsoDate(post.updatedAt || post.publishedAt));
}

export function jsonLd(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl(organizationLogo),
    sameAs: ['https://github.com/Eric00739'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'sales@gateremotesource.com',
        telephone: '+86 158 9964 8898',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Italian', 'Portuguese', 'Spanish', 'Russian', 'French'],
      },
    ],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: absoluteUrl(`/${locale}`),
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function contentText(block: BlogPostContentBlock) {
  switch (block.type) {
    case 'heading':
    case 'paragraph':
    case 'quote':
      return block.text;
    case 'callout':
      return `${block.title || ''} ${block.text}`;
    case 'list':
      return block.items.join(' ');
    case 'image':
      return `${block.alt} ${block.caption || ''}`;
  }
}

export function articleWordCount(post: BlogPost) {
  const text = [post.title, post.excerpt, ...post.content.map(contentText)].join(' ');

  return text.split(/\s+/).filter(Boolean).length;
}

export function blogPostingJsonLd({
  post,
  locale,
  categoryLabel,
}: {
  post: BlogPost;
  locale: Locale;
  categoryLabel: string;
}) {
  const url = absoluteUrl(`/${locale}/blog/${post.slug}`);
  const image = post.image ? absoluteUrl(post.image) : absoluteUrl(defaultOgImage);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    alternativeHeadline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished: toIsoDate(post.publishedAt),
    dateModified: toIsoDate(post.updatedAt || post.publishedAt),
    author: {
      '@type': 'Person',
      name: post.author || 'Eric Huang',
      url: absoluteUrl('/en#contact'),
      image: absoluteUrl('/images/eric-huang-avatar.webp'),
      jobTitle: 'RF Remote Control Specialist',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(organizationLogo),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: categoryLabel,
    wordCount: articleWordCount(post),
    inLanguage: locale,
  };
}
