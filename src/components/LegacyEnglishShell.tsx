import type { ReactNode } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadModalProvider from '@/components/LeadModalProvider';
import { I18nProvider } from '@/i18n';
import { getDictSync } from '@/i18n/dictionaries';

export default function LegacyEnglishShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider locale="en" dict={getDictSync('en')}>
      <LeadModalProvider>
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </LeadModalProvider>
    </I18nProvider>
  );
}
