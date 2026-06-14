import type { Metadata } from 'next';
import BlogIndexClient from '@/components/BlogIndexClient';
import LeadModalProvider from '@/components/LeadModalProvider';
import LegacyEnglishShell from '@/components/LegacyEnglishShell';

export const metadata: Metadata = {
  title: 'Blog & Compatibility Guides | GateRemoteSource',
  robots: { index: false, follow: true },
  alternates: { canonical: '/en/blog' },
};

export default function LegacyBlogPage() {
  return (
    <LegacyEnglishShell>
      <LeadModalProvider>
        <BlogIndexClient />
      </LeadModalProvider>
    </LegacyEnglishShell>
  );
}
