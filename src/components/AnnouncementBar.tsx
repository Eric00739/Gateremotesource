'use client';

import LeadModalTrigger from './LeadModalTrigger';
import { useDict } from '@/i18n';

export default function AnnouncementBar() {
  const dict = useDict();

  return (
    <div className="bg-[#062748] relative overflow-hidden border-b border-[#123D63]">
      <div className="waveform-sweep" />
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8 gap-4">
        <p className="min-w-0 truncate text-[10px] text-[#C7D7E8] font-medium tracking-wider" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
          {dict.announcement.text}
        </p>
        <LeadModalTrigger
          prefillType="support"
          className="hidden sm:flex text-[10px] text-[#FF8A1F] hover:text-[#F97316] transition-colors font-semibold tracking-wide items-center gap-2 flex-shrink-0 cursor-pointer bg-transparent border-none"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <span className="signal-dot" />
          {dict.announcement.cta}
        </LeadModalTrigger>
      </div>
    </div>
  );
}
