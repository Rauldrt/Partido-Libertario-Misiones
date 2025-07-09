
"use client";

import React, { createContext, useState, useContext, type PropsWithChildren } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmbedDisplay } from '@/components/EmbedDisplay';

interface ModalState {
  isOpen: boolean;
  embedCode: string;
  title: string;
}

interface SocialModalContextType {
  openModal: (options: Omit<ModalState, 'isOpen'>) => void;
}

const SocialModalContext = createContext<SocialModalContextType | undefined>(undefined);

export function SocialModalProvider({ children }: PropsWithChildren) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    embedCode: '',
    title: '',
  });

  const openModal = (options: Omit<ModalState, 'isOpen'>) => {
    setModalState({ isOpen: true, ...options });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, embedCode: '', title: '' });
  };

  return (
    <SocialModalContext.Provider value={{ openModal }}>
      {children}
      <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
        <DialogContent 
            className="p-0 flex flex-col w-[90vw] h-[90vh] max-w-[1200px]" 
        >
          <DialogHeader className="p-4 pb-2 flex-shrink-0 border-b">
            <DialogTitle className="font-headline text-primary">{modalState.title}</DialogTitle>
          </DialogHeader>
          <div 
            className="flex-grow rounded-b-lg overflow-auto bg-background w-full h-full"
          >
            <div className="w-full h-full [&>div]:w-full [&>div]:h-full">
              <EmbedDisplay embedCode={modalState.embedCode} />
            </div>
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
