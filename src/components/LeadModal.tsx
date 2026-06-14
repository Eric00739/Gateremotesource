'use client';

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { useLeadModal } from './LeadModalProvider';
import { localeNames, useDict, useLocale } from '@/i18n';

const WHATSAPP_NUMBER = '8615899648898';
const EMAIL = 'sales@gateremotesource.com';

const prefillTypeToRequestType: Record<string, string> = {
  quote: 'quote',
  compatibility: 'compatibility',
  oem: 'oem',
  sample: 'sample',
  support: 'compatibility',
};

function LeadModalContent() {
  const { open, prefillType, closeModal } = useLeadModal();
  const dict = useDict();
  const locale = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState(prefillTypeToRequestType[prefillType] || 'quote');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, closeModal]);

  if (!open) return null;

  const requestTypeOptions = [
    { value: 'quote', label: dict.leadModal.requestTypes.quote },
    { value: 'compatibility', label: dict.leadModal.requestTypes.compatibility },
    { value: 'oem', label: dict.leadModal.requestTypes.oem },
    { value: 'sample', label: dict.leadModal.requestTypes.sample },
    { value: 'support', label: dict.leadModal.requestTypes.support },
  ];

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).map(f => f.name);
    setFiles(prev => [...prev, ...selected]);
  };

  const buildMessage = (): string => {
    const label = requestTypeOptions.find(o => o.value === requestType)?.label || requestType;
    return [
      `${dict.leadModal.messageNameLabel}: ${name}`,
      `${dict.leadModal.messageEmailLabel}: ${email}`,
      `${dict.leadModal.messageRequestLabel}: ${label}`,
      `${dict.leadModal.messageLocaleLabel}: ${localeNames[locale]}`,
      message,
    ].filter(Boolean).join('\n');
  };

  const handleSubmit = (action: () => void) => {
    if (!name.trim() || !email.trim()) return;
    action();
    if (files.length > 0) {
      alert(`${dict.leadModal.rememberAttach}: ${files.join(', ')}`);
    }
    setName('');
    setEmail('');
    setMessage('');
    setFiles([]);
    setRequestType(prefillTypeToRequestType[prefillType] || 'quote');
    closeModal();
  };

  const inputClass = 'w-full rounded-lg border border-[#D8E4F0] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-colors focus:border-[#FF8A1F]/60 focus:bg-white';
  const labelClass = 'block text-[11px] font-semibold text-[#64748B] mb-1.5 tracking-wide';

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === overlayRef.current) closeModal(); }}
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-5 py-3.5 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-base font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            {dict.leadModal.title}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            aria-label={dict.leadModal.closeLabel}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-3.5">
          <div>
            <label className={labelClass}>{dict.leadModal.nameLabel}</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder={dict.leadModal.namePlaceholder} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>{dict.leadModal.emailLabel}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={dict.leadModal.emailPlaceholder} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>{dict.leadModal.requestTypeLabel}</label>
            <select value={requestType} onChange={e => setRequestType(e.target.value)} className={inputClass}>
              {requestTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>{dict.leadModal.detailsLabel}</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={dict.leadModal.detailsPlaceholder} rows={4} className={`${inputClass} resize-none`} />
          </div>

          {/* Attachments */}
          <div>
            <label className={labelClass}>{dict.leadModal.attachmentsLabel}</label>
            <input type="file" multiple ref={fileInputRef} onChange={handleFiles} className="hidden" accept="image/*,.pdf,.doc,.docx" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-2 rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#64748B] hover:border-[#FF8A1F]/50 hover:text-[#FF8A1F] transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
              {dict.leadModal.addFiles}
            </button>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-[#64748B] bg-[#F1F5F9] rounded px-2 py-1">
                    <span className="truncate mr-2">{f}</span>
                    <button type="button" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="text-[#94A3B8] hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-[#94A3B8] mt-1.5">{dict.leadModal.attachmentNote}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-[#E2E8F0] px-5 py-3.5 flex flex-col sm:flex-row gap-2.5 rounded-b-2xl">
          <button
            type="button"
            disabled={!name.trim() || !email.trim()}
            onClick={() => {
              const text = buildMessage();
              handleSubmit(() => {
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
              });
            }}
            className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            {dict.leadModal.sendWhatsApp}
          </button>
          <button
            type="button"
            disabled={!name.trim() || !email.trim()}
            onClick={() => {
              const text = buildMessage();
              const label = requestTypeOptions.find(o => o.value === requestType)?.label || dict.leadModal.messageFallbackType;
              handleSubmit(() => {
                const subject = encodeURIComponent(`${dict.leadModal.messageSubjectPrefix}: ${label}`);
                const body = encodeURIComponent(text);
                window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
              });
            }}
            className="flex-1 bg-[#0B3A63] hover:bg-[#062748] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            {dict.leadModal.sendEmail}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LeadModalContent;
