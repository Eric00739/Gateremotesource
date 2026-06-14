'use client';

import { FormEvent, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function BlogCommentBox({ articleTitle }: { articleTitle: string }) {
  const [status, setStatus] = useState('Your comment opens as an email draft so you can review it before sending.');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const company = String(form.get('company') || '').trim();
    const message = String(form.get('message') || '').trim();

    const body = [
      `Article: ${articleTitle}`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'Not provided'}`,
      '',
      'Comment:',
      message,
    ].join('\n');

    const mailto = new URL('mailto:sales@gateremotesource.com');
    mailto.searchParams.set('subject', `Blog comment: ${articleTitle}`);
    mailto.searchParams.set('body', body);
    window.location.href = mailto.toString();
    setStatus('Email draft opened. Please review it in your mail app before sending.');
  };

  return (
    <section
      id="comments"
      data-testid="blog-comments"
      className="mt-10 w-full scroll-mt-24 rounded-lg border border-[#D7E2EE] bg-[#F8FAFC] p-5 shadow-sm shadow-[#0F172A]/5 sm:p-6"
      aria-labelledby="comments-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C45A00]"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
          >
            <MessageSquare className="h-4 w-4" />
            Comments
          </p>
          <h2
            id="comments-title"
            className="mt-2 break-words text-xl font-bold leading-tight text-[#0F172A] sm:text-2xl"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            Leave a comment or RF question
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#475569]">
            Share your unstable range, batch consistency, matching, filtering, case effect, or export production question. Eric will review the details and reply directly.
          </p>
        </div>
        <p className="w-full rounded-md border border-[#FFE0B8] bg-[#FFF7ED] px-3 py-2 text-xs leading-5 text-[#9A3412] sm:max-w-[220px]">
          Comments are handled by email for now, so you can review the message before sending.
        </p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid min-w-0 gap-2 text-xs font-bold text-[#334155]">
            Name
            <input
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#FF8A1F] focus:outline-none"
            />
          </label>
          <label className="grid min-w-0 gap-2 text-xs font-bold text-[#334155]">
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#FF8A1F] focus:outline-none"
            />
          </label>
        </div>
        <label className="grid min-w-0 gap-2 text-xs font-bold text-[#334155]">
          <span>
            Company <span className="font-medium text-[#64748B]">(optional)</span>
          </span>
          <input
            name="company"
            type="text"
            placeholder="Company name"
            className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#FF8A1F] focus:outline-none"
          />
        </label>
        <label className="grid min-w-0 gap-2 text-xs font-bold text-[#334155]">
          Comment
          <textarea
            name="message"
            required
            rows={4}
            placeholder="What unstable RF problem did you meet?"
            className="w-full resize-y rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm leading-6 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#FF8A1F] focus:outline-none"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF8A1F] px-5 py-2.5 text-sm font-bold text-[#062748] transition-colors hover:bg-[#F97316]"
          >
            Send Comment <Send className="h-4 w-4" />
          </button>
          <p className="text-xs leading-5 text-[#64748B]">{status}</p>
        </div>
      </form>
    </section>
  );
}
