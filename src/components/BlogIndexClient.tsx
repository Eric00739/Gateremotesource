'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock, FileText, MessageSquare, Radio, Search, UserRound } from 'lucide-react';
import { authorProfile } from '@/data/author';
import { blogCategories, blogPosts, popularGuides, type BlogPost } from '@/data/blog';
import LeadModalTrigger from '@/components/LeadModalTrigger';
import { useDict, useLocale } from '@/i18n';

const ARTICLES_PER_PAGE = 10;

function formatDate(date?: string) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(parsed);
}

function getPostSortTime(post: BlogPost) {
  const sortDate = post.publishedAt || post.updatedAt;
  if (!sortDate) return 0;

  const parsed = new Date(sortDate);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function sortPostsNewestFirst(posts: BlogPost[]) {
  return posts
    .map((post, index) => ({ post, index }))
    .sort((a, b) => {
      const timeDifference = getPostSortTime(b.post) - getPostSortTime(a.post);
      return timeDifference || a.index - b.index;
    })
    .map(({ post }) => post);
}

function ArticleMeta({ post }: { post: BlogPost }) {
  const dateLabel = formatDate(post.publishedAt);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#64748B]">
      {post.author && <span>{post.author}</span>}
      {dateLabel && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {dateLabel}
        </span>
      )}
      {post.readTime && (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {post.readTime}
        </span>
      )}
    </div>
  );
}

export default function BlogIndexClient() {
  const dict = useDict();
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryLabels: Record<string, string> = {
    all: dict.blog.categories.all,
    'rf-engineering': 'RF Engineering',
    compatibility: dict.blog.categories.compatibility,
    'rolling-code': dict.blog.categories.rollingCode,
    'oem-odm': dict.blog.categories.oemOdm,
    'buyer-checklist': dict.blog.categories.buyerChecklist,
    troubleshooting: dict.blog.categories.troubleshooting,
  };

  const topicDescriptions: Record<string, string> = {
    'rf-engineering': 'Circuit stability, range, tuning, filtering, and real product reliability.',
    compatibility: 'Frequency, chip, brand, receiver, and replacement matching references.',
    'rolling-code': 'Fixed code, rolling code, security, and protocol decisions.',
    'oem-odm': 'Product control, factory choice, certification, and long-term supply chain strategy.',
    'buyer-checklist': 'What to prepare before samples, quotations, or compatibility checks.',
    troubleshooting: 'Practical causes behind unstable range, pairing failure, and batch variation.',
  };

  const sortedBlogPosts = useMemo(() => sortPostsNewestFirst(blogPosts), []);

  const filteredPosts = useMemo(() => {
    const postsByCategory = selectedCategory === 'all'
      ? sortedBlogPosts
      : sortedBlogPosts.filter((post) => post.category === selectedCategory);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return postsByCategory;

    return postsByCategory.filter((post) => {
      const searchableText = [
        post.title,
        post.excerpt,
        post.category,
        post.author,
        post.readTime,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [searchQuery, selectedCategory, sortedBlogPosts]);
  const categoryCounts = useMemo(() => {
    return blogCategories.reduce<Record<string, number>>((counts, category) => {
      counts[category.key] = category.key === 'all'
        ? blogPosts.length
        : blogPosts.filter((post) => post.category === category.key).length;
      return counts;
    }, {});
  }, []);
  const activeCategories = blogCategories.filter(
    (category) => category.key === 'all' || categoryCounts[category.key] > 0,
  );
  const emptyCategoryCount = blogCategories.filter(
    (category) => category.key !== 'all' && categoryCounts[category.key] === 0,
  ).length;

  const featuredPost = filteredPosts[0];
  const articleList = featuredPost
    ? filteredPosts.filter((post) => post.slug !== featuredPost.slug)
    : [];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(Math.ceil(filteredPosts.length / ARTICLES_PER_PAGE), 1);
  const isFirstPage = currentPage === 1;
  const articleStartIndex = isFirstPage
    ? 0
    : (ARTICLES_PER_PAGE - 1) + (currentPage - 2) * ARTICLES_PER_PAGE;
  const articleEndIndex = isFirstPage
    ? ARTICLES_PER_PAGE - 1
    : articleStartIndex + ARTICLES_PER_PAGE;
  const paginatedArticleList = articleList.slice(articleStartIndex, articleEndIndex);
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b)
      .reduce<(number | string)[]>((items, page) => {
        const previous = items[items.length - 1];
        if (typeof previous === 'number' && page - previous > 1) {
          items.push(`ellipsis-${previous}-${page}`);
        }
        items.push(page);
        return items;
      }, []);
  }, [currentPage, totalPages]);
  const startHerePosts = sortedBlogPosts.slice(0, 2);
  const startHereSlugs = new Set(startHerePosts.map((post) => post.slug));
  const popularPosts = popularGuides
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter((post): post is BlogPost => Boolean(post))
    .filter((post) => !startHereSlugs.has(post.slug));
  const activeCategoryLabel = categoryLabels[selectedCategory] || selectedCategory;

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    document.getElementById('blog-article-library')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const renderCategoryButton = (category: { key: string; label: string }) => {
    const isActive = selectedCategory === category.key;
    const count = categoryCounts[category.key] || 0;

    return (
      <button
        key={category.key}
        type="button"
        onClick={() => handleCategorySelect(category.key)}
        className={`inline-flex shrink-0 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
          isActive
            ? 'border-[#FF8A1F] bg-[#FFF7ED] text-[#C45A00]'
            : 'border-[#D7E2EE] bg-white text-[#475569] hover:border-[#FF8A1F]/60 hover:text-[#0F172A]'
        }`}
        style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
      >
        <span className="truncate uppercase tracking-[0.12em]">
          {categoryLabels[category.key] || category.label}
        </span>
        <span className="shrink-0 text-[11px]">{count}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="bg-[#F8FAFC]">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p
              className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6B7F96]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
            >
              Editorial
            </p>
            <h1
              className="text-4xl font-extrabold leading-[0.98] text-[#0F172A] sm:text-5xl lg:text-[56px]"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {dict.blog.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#475569]">
              {dict.blog.subtitle}
            </p>
          </div>
          <div className="grid gap-3 self-end sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-lg border border-[#D7E2EE] bg-white px-4 py-3 shadow-sm shadow-[#0F172A]/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                Articles
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {blogPosts.length}
              </p>
            </div>
            <div className="rounded-lg border border-[#D7E2EE] bg-white px-4 py-3 shadow-sm shadow-[#0F172A]/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                Topics
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {activeCategories.length - 1}
              </p>
            </div>
            <div className="rounded-lg border border-[#D7E2EE] bg-white px-4 py-3 shadow-sm shadow-[#0F172A]/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                Current view
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                {activeCategoryLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-14">
          {blogPosts.length > 0 ? (
            <>
              <main id="blog-article-library" className="min-w-0">
                <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C45A00]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                      <Search className="h-4 w-4" />
                      Library
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                      {activeCategoryLabel} articles
                    </h2>
                  </div>
                  <p className="text-sm text-[#64748B]">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                  </p>
                </div>

                <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {activeCategories.map((category) => renderCategoryButton(category))}
                  </div>
                  <label className="relative block">
                    <span className="sr-only">Search blog articles</span>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => handleSearchChange(event.target.value)}
                      placeholder="Search title, topic, problem..."
                      className="h-10 w-full rounded-lg border border-[#D7E2EE] bg-white pl-10 pr-3 text-sm font-medium text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#FF8A1F]"
                    />
                  </label>
                </div>

                {isFirstPage && featuredPost ? (
                  <Link
                    href={`/${locale}/blog/${featuredPost.slug}`}
                    className="group mt-6 grid overflow-hidden rounded-lg border border-[#D7E2EE] bg-[#F8FAFC] shadow-sm shadow-[#0F172A]/5 transition-all hover:-translate-y-0.5 hover:border-[#FF8A1F]/60 hover:shadow-md md:grid-cols-[minmax(0,1fr)_280px]"
                  >
                    <div className="p-5 sm:p-6">
                      <span
                        className="inline-flex rounded-full border border-[#FF8A1F]/25 bg-[#FFF7ED] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C45A00]"
                        style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                      >
                        Featured guide
                      </span>
                      <h3
                        className="mt-4 text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl"
                        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                      >
                        {featuredPost.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-[#475569]">
                        {featuredPost.excerpt}
                      </p>
                      <div className="mt-5">
                        <ArticleMeta post={featuredPost} />
                      </div>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#FF8A1F] transition-all group-hover:gap-3">
                        {dict.blog.readMore} <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                    {featuredPost.image && (
                      <div className="relative min-h-[220px] border-t border-[#D7E2EE] bg-[#062748] md:border-l md:border-t-0">
                        <Image
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 280px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </Link>
                ) : null}

                {articleList.length > 0 && (
                  <div className="mt-6 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm shadow-[#0F172A]/5">
                    <div className="flex flex-col gap-1 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]"
                        style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                      >
                        Article index
                      </p>
                      <p className="text-xs text-[#64748B]">
                        Compact view for larger content libraries
                      </p>
                    </div>
                    <div className="divide-y divide-[#E2E8F0]">
                      {paginatedArticleList.map((post) => {
                        const categoryLabel = categoryLabels[post.category] || post.category;

                        return (
                          <Link
                            key={post.slug}
                            href={`/${locale}/blog/${post.slug}`}
                            className="group flex flex-col gap-4 px-4 py-4 transition-colors hover:bg-[#F8FAFC] sm:flex-row sm:items-start"
                          >
                            {post.image && (
                              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-md bg-[#062748] sm:w-32">
                                <Image
                                  src={post.image}
                                  alt={post.title}
                                  fill
                                  sizes="(max-width: 640px) 100vw, 128px"
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span
                                className="inline-flex max-w-full rounded-full border border-[#FF8A1F]/25 bg-[#FFF7ED] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C45A00]"
                                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                              >
                                {categoryLabel}
                              </span>
                              <h3
                                className="mt-3 text-lg font-bold leading-snug text-[#0F172A] group-hover:text-[#C45A00] sm:text-xl"
                                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                              >
                                {post.title}
                              </h3>
                              <p className="mt-2 text-sm leading-6 text-[#475569]">
                                {post.excerpt}
                              </p>
                              <div className="mt-5">
                                <ArticleMeta post={post} />
                              </div>
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-bold text-[#FF8A1F] transition-all group-hover:gap-3 sm:mt-2">
                              {dict.blog.readMore} <ArrowRight className="h-4 w-4" />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex flex-col gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-medium text-[#64748B]">
                          Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D7E2EE] bg-white px-3 text-xs font-bold text-[#0F172A] transition-colors hover:border-[#FF8A1F]/60 hover:text-[#C45A00] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#D7E2EE] disabled:hover:text-[#0F172A]"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            {dict.blog.pagination.prev}
                          </button>
                          {paginationItems.map((item) => (
                            typeof item === 'number' ? (
                              <button
                                key={item}
                                type="button"
                                onClick={() => handlePageChange(item)}
                                aria-current={item === currentPage ? 'page' : undefined}
                                className={`h-9 min-w-9 rounded-lg border px-3 text-xs font-bold transition-colors ${
                                  item === currentPage
                                    ? 'border-[#FF8A1F] bg-[#FFF7ED] text-[#C45A00]'
                                    : 'border-[#D7E2EE] bg-white text-[#0F172A] hover:border-[#FF8A1F]/60 hover:text-[#C45A00]'
                                }`}
                              >
                                {item}
                              </button>
                            ) : (
                              <span
                                key={item}
                                className="flex h-9 min-w-9 items-center justify-center text-xs font-bold text-[#94A3B8]"
                              >
                                ...
                              </span>
                            )
                          ))}
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D7E2EE] bg-white px-3 text-xs font-bold text-[#0F172A] transition-colors hover:border-[#FF8A1F]/60 hover:text-[#C45A00] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#D7E2EE] disabled:hover:text-[#0F172A]"
                          >
                            {dict.blog.pagination.next}
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {!featuredPost && (
                  <div className="mt-6 rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center">
                    <p className="text-sm text-[#64748B]">
                      {searchQuery.trim() ? 'No articles match this search yet.' : 'No articles in this topic yet.'}
                    </p>
                  </div>
                )}
              </main>

              <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
                <div className="space-y-5">
                  <section className="rounded-lg border border-[#D7E2EE] bg-white p-5 shadow-sm shadow-[#0F172A]/5">
                    <h2
                      className="flex items-center gap-2 text-sm font-bold text-[#0F172A]"
                      style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                    >
                      <Radio className="h-4 w-4 text-[#FF8A1F]" />
                      Topic map
                    </h2>
                    <div className="mt-4 space-y-4">
                      {blogCategories
                        .filter((category) => category.key !== 'all' && categoryCounts[category.key] > 0)
                        .map((category) => {
                          const count = categoryCounts[category.key] || 0;

                          return (
                            <button
                              key={category.key}
                              type="button"
                              onClick={() => handleCategorySelect(category.key)}
                              className="group w-full border-b border-[#E2E8F0] pb-4 text-left last:border-b-0 last:pb-0"
                            >
                              <span className="flex items-center justify-between gap-3">
                                <span className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                                  {categoryLabels[category.key] || category.label}
                                </span>
                                <span className="rounded-full bg-[#EEF4FA] px-2 py-1 text-[11px] font-bold text-[#64748B]">
                                  {count}
                                </span>
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-[#64748B] group-hover:text-[#475569]">
                                {topicDescriptions[category.key]}
                              </span>
                            </button>
                          );
                        })}
                      {emptyCategoryCount > 0 && (
                        <p className="rounded-md bg-[#F8FAFC] px-3 py-2 text-xs leading-5 text-[#64748B]">
                          {emptyCategoryCount} more topics are being prepared.
                        </p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-lg border border-[#D7E2EE] bg-white p-5 shadow-sm shadow-[#0F172A]/5">
                    <h2
                      className="text-sm font-bold text-[#0F172A]"
                      style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                    >
                      Start here
                    </h2>
                    <div className="mt-4 grid gap-3">
                      {startHerePosts.map((post, index) => (
                        <Link
                          key={post.slug}
                          href={`/${locale}/blog/${post.slug}`}
                          className="group grid grid-cols-[28px_1fr] gap-3 rounded-md p-2 transition-colors hover:bg-[#F8FAFC]"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF7ED] text-[11px] font-bold text-[#C45A00]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 text-sm font-bold leading-5 text-[#0F172A] group-hover:text-[#C45A00]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                            {post.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>

                  {popularPosts.length > 0 && (
                    <section className="rounded-lg border border-[#D7E2EE] bg-white p-5 shadow-sm shadow-[#0F172A]/5">
                      <h2
                        className="text-sm font-bold text-[#0F172A]"
                        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                      >
                        Popular guides
                      </h2>
                      <div className="mt-4 grid gap-3">
                        {popularPosts.map((post) => (
                          <Link
                            key={post.slug}
                            href={`/${locale}/blog/${post.slug}`}
                            className="group flex items-start justify-between gap-3 rounded-md p-2 transition-colors hover:bg-[#F8FAFC]"
                          >
                            <span className="min-w-0 text-sm font-bold leading-5 text-[#0F172A] group-hover:text-[#C45A00]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                              {post.title}
                            </span>
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#FF8A1F]" />
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="rounded-lg border border-[#D7E2EE] bg-[#062748] p-5 shadow-sm shadow-[#0F172A]/10">
                    <div className="flex items-center gap-3">
                      <Image
                        src={authorProfile.avatar}
                        alt={authorProfile.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full border border-[#FF8A1F]/60 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFB15A]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                          <UserRound className="h-3.5 w-3.5" />
                          Ask Eric
                        </p>
                        <h2 className="mt-1 text-sm font-bold text-[#F7FBFF]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                          RF sourcing question?
                        </h2>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-6 text-[#C7D7E8]">
                      Send the model, frequency, chip photo, or project target. Eric can help check the right technical path before sampling.
                    </p>
                    <LeadModalTrigger
                      prefillType="support"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8A1F] px-4 py-2.5 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
                    >
                      Ask a question <MessageSquare className="h-4 w-4" />
                    </LeadModalTrigger>
                  </section>
                </div>
              </aside>
            </>
          ) : (
            <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#FF8A1F] shadow-sm">
                <FileText className="h-6 w-6" />
              </div>
              <h2
                className="mt-6 text-2xl font-bold text-[#0F172A]"
                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
              >
                Articles are being prepared
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#64748B]">
                The previous placeholder articles have been removed. New technical articles will appear here after your own content is added.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 border-t border-[#E2E8F0] pt-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3
                className="text-xl font-bold text-[#0F172A]"
                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
              >
                {dict.blog.helpTitle}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-7 text-[#64748B]">
                {dict.blog.helpSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {blogCategories
                .filter((category) => category.key !== 'all' && categoryCounts[category.key] > 0)
                .slice(0, 4)
                .map((category) => (
                  <span
                    key={category.key}
                    className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#64748B]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                  >
                    {categoryLabels[category.key] || category.label}
                  </span>
                ))}
            </div>
            <LeadModalTrigger
              prefillType="support"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#FF8A1F] px-6 py-3 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
            >
              {dict.blog.helpCta} <ArrowRight className="h-4 w-4" />
            </LeadModalTrigger>
          </div>
        </div>
      </section>
    </div>
  );
}
