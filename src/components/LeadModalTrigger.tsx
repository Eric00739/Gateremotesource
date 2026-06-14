'use client';

import { useLeadModal, type PrefillType } from './LeadModalProvider';

export default function LeadModalTrigger({
  prefillType,
  className,
  style,
  onClick,
  children,
}: {
  prefillType: PrefillType;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const { openModal } = useLeadModal();

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => { openModal(prefillType); onClick?.(); }}
    >
      {children}
    </button>
  );
}
