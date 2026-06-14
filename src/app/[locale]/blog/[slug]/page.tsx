import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays, ChevronDown, Clock, ListChecks, MessageSquare } from 'lucide-react';
import { blogCategories, blogPosts, type BlogInlineLink, type BlogPost, type BlogPostContentBlock } from '@/data/blog';
import { notFound } from 'next/navigation';
import LeadModalTrigger from '@/components/LeadModalTrigger';
import AuthorBio from '@/components/AuthorBio';
import BlogCommentBox from '@/components/BlogCommentBox';
import { defaultLocale, type Locale, locales } from '@/i18n';
import { getDictSync } from '@/i18n/dictionaries';
import { siteName } from '@/data/site';
import { absoluteUrl, blogPostingJsonLd, breadcrumbJsonLd, jsonLd } from '@/lib/seo';

const emptyBlogSlug = '__no-articles__';

export const dynamicParams = false;

export async function generateStaticParams() {
  if (blogPosts.length === 0) {
    return [{ slug: emptyBlogSlug }];
  }

  return blogPosts.map((post) => ({ slug: post.slug }));
}

function formatDate(date?: string) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(parsed);
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type ArticleSection = {
  title: string;
  id: string;
  blockIndex: number;
};

function buildArticleSections(content: BlogPostContentBlock[]) {
  const slugCounts = new Map<string, number>();

  return content.reduce<ArticleSection[]>((sections, block, blockIndex) => {
    if (block.type !== 'heading') return sections;

    const baseSlug = slugifyHeading(block.text) || `section-${blockIndex + 1}`;
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);

    sections.push({
      title: block.text,
      id: count === 0 ? baseSlug : `${baseSlug}-${count + 1}`,
      blockIndex,
    });

    return sections;
  }, []);
}

function resolveInternalHref(href: string, locale: Locale) {
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  if (href.startsWith(`/${locale}/`) || href === `/${locale}` || href.startsWith(`/${locale}#`)) return href;
  if (href.startsWith('/')) return `/${locale}${href}`;
  if (href.startsWith('#')) return href;
  return href;
}

function renderLinkedText(text: string, links: BlogInlineLink[] | undefined, locale: Locale) {
  if (!links || links.length === 0) return text;

  const pieces: ReactNode[] = [];
  let cursor = 0;

  for (const link of links) {
    const start = text.indexOf(link.text, cursor);
    if (start < 0) continue;

    if (start > cursor) {
      pieces.push(text.slice(cursor, start));
    }

    pieces.push(
      <Link
        key={`${link.href}-${start}`}
        href={resolveInternalHref(link.href, locale)}
        className="font-semibold text-[#C45A00] underline decoration-[#F7C88B] decoration-1 underline-offset-4 transition-colors hover:text-[#FF8A1F]"
      >
        {link.text}
      </Link>,
    );
    cursor = start + link.text.length;
  }

  if (cursor < text.length) {
    pieces.push(text.slice(cursor));
  }

  return pieces.length > 0 ? pieces : text;
}

function getRelatedPosts(post: BlogPost) {
  const relatedBySlug = (post.relatedSlugs || [])
    .map((slug) => blogPosts.find((item) => item.slug === slug))
    .filter((item): item is BlogPost => Boolean(item))
    .filter((item) => item.slug !== post.slug);

  const relatedSlugs = new Set(relatedBySlug.map((item) => item.slug));
  const sameCategory = blogPosts.filter(
    (item) => item.slug !== post.slug && item.category === post.category && !relatedSlugs.has(item.slug),
  );
  const fallback = blogPosts.filter(
    (item) => item.slug !== post.slug && !relatedSlugs.has(item.slug) && !sameCategory.some((same) => same.slug === item.slug),
  );

  return [...relatedBySlug, ...sameCategory, ...fallback].slice(0, 3);
}

function RelatedArticles({
  currentPost,
  locale,
  categoryLabels,
}: {
  currentPost: BlogPost;
  locale: Locale;
  categoryLabels: Record<string, string>;
}) {
  const relatedPosts = getRelatedPosts(currentPost);
  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-10 border-t border-[#E2E8F0] pt-8" aria-labelledby="related-articles">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C45A00]"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
          >
            Keep reading
          </p>
          <h2
            id="related-articles"
            className="mt-2 text-xl font-bold text-[#0F172A]"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            Related articles
          </h2>
        </div>
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#FF8A1F] transition-colors hover:text-[#F97316]"
        >
          View library <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {relatedPosts.map((relatedPost) => (
          <Link
            key={relatedPost.slug}
            href={`/${locale}/blog/${relatedPost.slug}`}
            className="group rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition-all hover:-translate-y-0.5 hover:border-[#FF8A1F]/50 hover:bg-white hover:shadow-sm"
          >
            <span
              className="inline-flex rounded-full border border-[#FF8A1F]/25 bg-[#FFF7ED] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C45A00]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
            >
              {categoryLabels[relatedPost.category] || relatedPost.category}
            </span>
            <h3
              className="mt-4 text-lg font-bold leading-tight text-[#0F172A] transition-colors group-hover:text-[#C45A00]"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {relatedPost.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#64748B]">
              {relatedPost.excerpt}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF8A1F]">
              Read next <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ArticleSectionsNav({
  sections,
  readTime,
  variant = 'desktop',
}: {
  sections: ArticleSection[];
  readTime?: string;
  variant?: 'desktop' | 'mobile';
}) {
  if (sections.length === 0) return null;

  const maxSections = variant === 'desktop' ? 9 : 12;
  const hiddenSections = Math.max(sections.length - maxSections, 0);
  const sectionCountLabel = `${sections.length} ${sections.length === 1 ? 'section' : 'sections'}`;

  if (variant === 'mobile') {
    return (
      <details className="group mb-8 rounded-lg border border-[#D7E2EE] bg-[#F8FAFC] shadow-sm lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 [&::-webkit-details-marker]:hidden">
          <span>
            <span
              className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C45A00]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
            >
              <ListChecks className="h-4 w-4" />
              Reading map
            </span>
            <span
              className="mt-1 block text-base font-bold text-[#0F172A]"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              Article sections
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-[#F7C88B] bg-white px-3 py-1 text-[11px] font-bold text-[#C45A00]">
              {sectionCountLabel}
            </span>
            <ChevronDown className="h-4 w-4 text-[#C45A00] transition-transform group-open:rotate-180" />
          </span>
        </summary>
        <nav aria-label="Article sections" className="grid gap-1 border-t border-[#E2E8F0] px-3 py-3">
          {sections.slice(0, maxSections).map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="grid grid-cols-[28px_1fr] gap-3 rounded-md px-2 py-2 text-sm leading-6 text-[#475569] transition-colors hover:bg-white hover:text-[#0F172A]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE8CC] text-[11px] font-bold text-[#C45A00]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 break-words">{section.title}</span>
            </a>
          ))}
          {hiddenSections > 0 && (
            <p className="px-2 py-2 text-xs leading-5 text-[#64748B]">
              +{hiddenSections} more sections in the article body
            </p>
          )}
        </nav>
      </details>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-[#D7E2EE] bg-white shadow-sm shadow-[#0F172A]/5">
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
        <p
          className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C45A00]"
          style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
        >
          <ListChecks className="h-4 w-4" />
          Reading map
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <h2
            className="text-base font-bold text-[#0F172A]"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            Article sections
          </h2>
          <span className="shrink-0 rounded-full border border-[#F7C88B] bg-white px-2.5 py-1 text-[11px] font-bold text-[#C45A00]">
            {sectionCountLabel}
          </span>
        </div>
        {readTime && <p className="mt-1 text-xs text-[#64748B]">{readTime}</p>}
      </div>
      <nav aria-label="Article sections" className="grid max-h-[46vh] gap-1 overflow-y-auto p-3 pr-2">
        {sections.slice(0, maxSections).map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group grid grid-cols-[28px_1fr] gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-[#FFF7ED]"
          >
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF4FA] text-[11px] font-bold text-[#64748B] transition-colors group-hover:bg-[#FF8A1F] group-hover:text-[#062748]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 break-words text-xs font-semibold leading-5 text-[#475569] transition-colors group-hover:text-[#0F172A]">
              {section.title}
            </span>
          </a>
        ))}
        {hiddenSections > 0 && (
          <p className="px-2 py-2 text-xs leading-5 text-[#64748B]">
            +{hiddenSections} more sections in the article body
          </p>
        )}
      </nav>
      <div className="border-t border-[#E2E8F0] p-4">
        <a
          href="#comments"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#F7C88B] bg-[#FFF7ED] px-4 py-2.5 text-xs font-bold text-[#C45A00] transition-colors hover:border-[#FF8A1F] hover:bg-[#FFE8CC]"
        >
          Comments <MessageSquare className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function renderBlock(block: BlogPostContentBlock, index: number, locale: Locale, headingId?: string) {
  switch (block.type) {
    case 'heading':
      return (
        <h2
          key={`${block.type}-${index}`}
          id={headingId || slugifyHeading(block.text) || `section-${index + 1}`}
          className="mt-9 break-words border-l-2 border-[#FF8A1F] pl-4 text-xl font-bold leading-snug text-[#0F172A]"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          {block.text}
        </h2>
      );
    case 'paragraph':
      return (
        <p key={`${block.type}-${index}`} className="mt-5 text-[15px] leading-8 text-[#334155]">
          {renderLinkedText(block.text, block.links, locale)}
        </p>
      );
    case 'list':
      return (
        <ul key={`${block.type}-${index}`} className="mt-5 space-y-3 text-[15px] leading-7 text-[#334155]">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF8A1F]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <aside
          key={`${block.type}-${index}`}
          className="mt-8 rounded-lg border border-[#F7C88B] bg-[#FFF7ED] p-5 text-[#334155]"
        >
          {block.title && (
            <h3
              className="mb-2 text-sm font-bold text-[#C45A00]"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {block.title}
            </h3>
          )}
          <p className="text-sm leading-7">{block.text}</p>
        </aside>
      );
    case 'quote':
      return (
        <blockquote
          key={`${block.type}-${index}`}
          className="mt-8 border-y border-[#E2E8F0] py-5 text-xl font-bold leading-snug text-[#062748]"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          {block.text}
        </blockquote>
      );
    case 'image':
      return (
        <figure key={`${block.type}-${index}`} className="mt-9">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 760px"
              loading={index === 0 ? 'eager' : 'lazy'}
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-[13px] leading-6 text-[#64748B]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? (rawLocale as Locale) : 'en';
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return { title: 'Article Not Found' };

  const title = `${post.seoTitle || post.title} | GateRemoteSource`;
  const isDefaultLocaleArticle = locale === defaultLocale;
  const canonicalPath = `/${defaultLocale}/blog/${post.slug}`;
  const openGraph: Metadata['openGraph'] = {
    type: 'article',
    siteName,
    url: canonicalPath,
    title,
    description: post.excerpt,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt,
    authors: post.author ? [post.author] : undefined,
  };

  if (post.image) {
    openGraph.images = [post.image];
  }

  return {
    title,
    description: post.excerpt,
    robots: isDefaultLocaleArticle ? undefined : { index: false, follow: true },
    alternates: {
      canonical: canonicalPath,
    },
    openGraph,
    twitter: {
      card: post.image ? 'summary_large_image' : 'summary',
      title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as Locale) ? (rawLocale as Locale) : 'en';
  const dict = getDictSync(locale);
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const categoryLabels: Record<string, string> = {
    all: dict.blog.categories.all,
    'rf-engineering': 'RF Engineering',
    compatibility: dict.blog.categories.compatibility,
    'rolling-code': dict.blog.categories.rollingCode,
    'oem-odm': dict.blog.categories.oemOdm,
    'buyer-checklist': dict.blog.categories.buyerChecklist,
    troubleshooting: dict.blog.categories.troubleshooting,
  };
  const categoryLabel =
    categoryLabels[post.category] ||
    blogCategories.find((category) => category.key === post.category)?.label ||
    post.category;
  const dateLabel = formatDate(post.publishedAt);
  const articleSections = buildArticleSections(post.content);
  const headingIdsByIndex = new Map(articleSections.map((section) => [section.blockIndex, section.id]));
  const isDefaultLocaleArticle = locale === defaultLocale;
  const articleJsonLd = blogPostingJsonLd({ post, locale: defaultLocale, categoryLabel });
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: absoluteUrl(`/${defaultLocale}`) },
    { name: 'Blog', url: absoluteUrl(`/${defaultLocale}/blog`) },
    { name: post.title, url: absoluteUrl(`/${defaultLocale}/blog/${post.slug}`) },
  ]);

  return (
    <div className="min-h-screen bg-white">
      {isDefaultLocaleArticle && (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd)} />
          <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
        </>
      )}
      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] transition-colors hover:text-[#FF8A1F]"
          >
            <ArrowLeft className="h-4 w-4" /> {dict.blogPost.backLink}
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden bg-[#062748]">
        <div className="absolute inset-0 tech-grid" />
        <div className="relative mx-auto max-w-[1280px] px-4 py-9 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="max-w-3xl">
            <p
              className="mb-3 inline-flex rounded-full bg-[#FF8A1F]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FF8A1F]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
            >
              {categoryLabel}
            </p>
            <h1
              className="break-words text-3xl font-extrabold leading-tight text-[#F7FBFF] [text-wrap:balance] sm:text-4xl lg:text-[44px]"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#9FB4CC] sm:text-sm">
              {post.author && <span>{post.author}</span>}
              {dateLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {dateLabel}
                </span>
              )}
              {post.readTime && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-[1120px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:py-12">
        <article className="min-w-0">
          <p className="break-words border-b border-[#FF8A1F] pb-4 text-base leading-8 text-[#1E293B] sm:text-lg">
            {post.excerpt}
          </p>
          <ArticleSectionsNav sections={articleSections} readTime={post.readTime} variant="mobile" />
          <div>{post.content.map((block, index) => renderBlock(block, index, locale, headingIdsByIndex.get(index)))}</div>
          <BlogCommentBox articleTitle={post.title} />
          <AuthorBio />
          <RelatedArticles currentPost={post} locale={locale} categoryLabels={categoryLabels} />

          <div className="mt-12 rounded-lg bg-[#062748] p-6">
            <h2
              className="text-lg font-bold text-[#F7FBFF]"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {dict.blogPost.needHelp}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#C7D7E8]">
              {dict.blogPost.needHelpSubtitle}
            </p>
            <LeadModalTrigger
              prefillType="support"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FF8A1F] px-5 py-2.5 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
            >
              {dict.blogPost.contactUs} <ArrowRight className="h-4 w-4" />
            </LeadModalTrigger>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <ArticleSectionsNav sections={articleSections} readTime={post.readTime} />

            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-sm">
              <AuthorBio variant="compact" />
            </div>

            <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <h2
                className="text-sm font-bold text-[#0F172A]"
                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
              >
                {dict.blog.helpTitle}
              </h2>
              <p className="mt-2 text-xs leading-6 text-[#64748B]">
                {dict.blog.helpSubtitle}
              </p>
              <LeadModalTrigger
                prefillType="support"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#FF8A1F] px-4 py-2.5 text-xs font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
              >
                {dict.blog.helpCta}
              </LeadModalTrigger>
            </div>

            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF8A1F] transition-colors hover:text-[#F97316]"
            >
              {dict.blogPost.backLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
