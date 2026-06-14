import type { Metadata } from 'next';
import LegacyEnglishShell from '@/components/LegacyEnglishShell';
import BlogPostPage from '@/app/[locale]/blog/[slug]/page';
import { blogPosts } from '@/data/blog';

const emptyBlogSlug = '__no-articles__';

export const dynamicParams = false;

export function generateStaticParams() {
  if (blogPosts.length === 0) {
    return [{ slug: emptyBlogSlug }];
  }

  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  return {
    title: post ? `${post.seoTitle || post.title} | GateRemoteSource` : 'Blog Article | GateRemoteSource',
    robots: { index: false, follow: true },
    alternates: { canonical: `/en/blog/${slug}` },
  };
}

export default async function LegacyBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <LegacyEnglishShell>
      {await BlogPostPage({ params: Promise.resolve({ slug, locale: 'en' }) })}
    </LegacyEnglishShell>
  );
}
