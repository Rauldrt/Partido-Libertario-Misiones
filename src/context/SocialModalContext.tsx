
"use client";

import React, { createContext, useState, useContext, type PropsWithChildren } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SocialModalContextType {
  openModal: (url: string, title: string) => void;
}

const SocialModalContext = createContext<SocialModalContextType | undefined>(undefined);

export function SocialModalProvider({ children }: PropsWithChildren) {
  const [modalState, setModalState] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const openModal = (url: string, title: string) => {
    setModalState({ isOpen: true, url, title });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, url: '', title: '' });
  };

  return (
    <SocialModalContext.Provider value={{ openModal }}>
      {children}
      <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[80vw] md:max-w-[60vw] h-[80vh] flex flex-col p-2">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="font-headline text-primary">{modalState.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow rounded-b-lg overflow-hidden">
            <iframe
              src={modalState.url}
              title={modalState.title}
              width="100%"
              height="100%"
              frameBorder="0"
            />
          </div>
        </DialogContent>
      </Dialog>
    </SocialModalContext.Provider>
  );
}

export function useSocialModal() {
  const context = useContext(SocialModalContext);
  if (context === undefined) {
    throw new Error('useSocialModal must be used within a SocialModalProvider');
  }
  return context;
}
