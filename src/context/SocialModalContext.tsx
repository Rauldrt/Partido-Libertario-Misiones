
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
        <DialogContent 
            className="p-2 flex flex-col" 
            style={{
                width: modalState.width || '90vw',
                height: modalState.height || '90vh',
                maxWidth: '90vw',
                maxHeight: '90vh'
            }}
        >
          <DialogHeader className="p-4 pb-2 flex-shrink-0">
            <DialogTitle className="font-headline text-primary">{modalState.title}</DialogTitle>
          </DialogHeader>
          <div 
            className="flex-grow rounded-b-lg overflow-auto bg-background flex items-center justify-center w-full h-full"
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
