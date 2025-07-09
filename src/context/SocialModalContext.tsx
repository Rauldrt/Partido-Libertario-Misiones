
"use client";

import React, { createContext, useState, useContext, type PropsWithChildren } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmbedDisplay } from '@/components/EmbedDisplay';

interface ModalState {
  isOpen: boolean;
  content: string; // Can be a URL or a full embed code
  title: string;
}

interface SocialModalContextType {
  openModal: (options: Omit<ModalState, 'isOpen'>) => void;
}

const SocialModalContext = createContext<SocialModalContextType | undefined>(undefined);

// Helper function to check if a string is a URL
const isUrl = (str: string): boolean => {
  try {
    // Use a simpler check: if it doesn't contain HTML tags, treat it as a URL.
    return !/<[a-z][\s\S]*>/i.test(str.trim());
  } catch (_) {
    return false;
  }
};


export function SocialModalProvider({ children }: PropsWithChildren) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    content: '',
    title: '',
  });

  const openModal = (options: Omit<ModalState, 'isOpen'>) => {
    setModalState({ isOpen: true, ...options });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, content: '', title: '' });
  };

  let finalEmbedCode = modalState.content;
  let useResponsiveWrapper = false;

  if (modalState.isOpen && isUrl(modalState.content)) {
     finalEmbedCode = `<iframe src="${modalState.content}" class="absolute top-0 left-0 w-full h-full" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
     useResponsiveWrapper = true;
  }

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
             {useResponsiveWrapper ? (
                <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
                    <EmbedDisplay embedCode={finalEmbedCode} />
                </div>
            ) : (
                <div className="w-full h-full [&>div]:w-full [&>div]:h-full">
                    <EmbedDisplay embedCode={finalEmbedCode} />
                </div>
            )}
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
