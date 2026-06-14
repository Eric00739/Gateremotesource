'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { authorProfile } from '@/data/author';
import LeadModalTrigger from './LeadModalTrigger';

type AuthorBioProps = {
  variant?: 'article' | 'compact' | 'footer';
  className?: string;
};

export default function AuthorBio({ variant = 'article', className = '' }: AuthorBioProps) {
  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Image
          src={authorProfile.avatar}
          alt={authorProfile.name}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full border border-[#FF8A1F]/50 object-cover"
        />
        <div>
          <p className="text-sm font-bold text-[#F7FBFF]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            {authorProfile.name}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#9FB4CC]">
            {authorProfile.experience}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Image
          src={authorProfile.avatar}
          alt={authorProfile.name}
          width={52}
          height={52}
          className="h-[52px] w-[52px] rounded-full border border-white object-cover shadow-sm"
        />
        <div>
          <p className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            {authorProfile.name}
          </p>
          <p className="mt-1 max-w-[260px] text-xs leading-5 text-[#64748B]">
            {authorProfile.experience}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className={`mt-10 border-t border-[#E2E8F0] pt-6 ${className}`} aria-labelledby="about-author">
      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-sm shadow-[#0F172A]/5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Image
            src={authorProfile.avatar}
            alt={authorProfile.name}
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full border-2 border-white object-cover shadow-md shadow-[#0F172A]/10"
          />
          <div className="min-w-0">
            <p
              className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C45A00]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
            >
              About the Author
            </p>
            <h2
              id="about-author"
              className="text-xl font-bold text-[#0F172A]"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {authorProfile.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#475569]">
              {authorProfile.title}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#334155]">
              {authorProfile.bio}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#334155]">
              {authorProfile.closing}
            </p>
            <LeadModalTrigger
              prefillType="support"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FF8A1F] px-4 py-2 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
            >
              Ask Eric a question <ArrowRight className="h-4 w-4" />
            </LeadModalTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}
