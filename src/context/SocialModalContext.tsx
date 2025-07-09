
"use client";

import React, { createContext, useState, useContext, type PropsWithChildren } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmbedDisplay } from '@/components/EmbedDisplay';

interface ModalState {
  isOpen: boolean;
  embedCode: string;
  title: string;
  width?: string;
  height?: string;
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
    width: undefined,
    height: undefined,
  });

  const openModal = (options: Omit<ModalState, 'isOpen'>) => {
    setModalState({ isOpen: true, ...options });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, embedCode: '', title: '', width: undefined, height: undefined });
  };

  return (
    <SocialModalContext.Provider value={{ openModal }}>
      {children}
      <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-auto h-auto flex flex-col p-2">
          <DialogHeader className="p-4 pb-2 flex-shrink-0">
            <DialogTitle className="font-headline text-primary">{modalState.title}</DialogTitle>
          </DialogHeader>
          <div 
            className="flex-grow rounded-b-lg overflow-auto bg-background flex items-center justify-center"
            style={{
                width: modalState.width || 'auto',
                height: modalState.height || 'auto'
            }}
          >
            <EmbedDisplay embedCode={modalState.embedCode} />
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
