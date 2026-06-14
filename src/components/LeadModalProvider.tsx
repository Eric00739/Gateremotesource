'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import LeadModal from './LeadModal';

export type PrefillType = 'quote' | 'compatibility' | 'oem' | 'sample' | 'support';

interface LeadModalContextValue {
  open: boolean;
  prefillType: PrefillType;
  openModal: (type: PrefillType) => void;
  closeModal: () => void;
}

const defaultValue: LeadModalContextValue = {
  open: false,
  prefillType: 'quote',
  openModal: () => {},
  closeModal: () => {},
};

const LeadModalContext = createContext<LeadModalContextValue>(defaultValue);

export function useLeadModal() {
  return useContext(LeadModalContext);
}

export default function LeadModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefillType, setPrefillType] = useState<PrefillType>('quote');

  const openModal = useCallback((type: PrefillType) => {
    setPrefillType(type);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <LeadModalContext.Provider value={{ open, prefillType, openModal, closeModal }}>
      {children}
      <LeadModal key={prefillType} />
    </LeadModalContext.Provider>
  );
}
