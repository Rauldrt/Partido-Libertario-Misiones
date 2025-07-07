"use client";

import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/PLMisiones/', icon: <Facebook className="h-6 w-6" /> },
  { label: 'Twitter', href: 'https://x.com/PLMisiones', icon: <Twitter className="h-6 w-6" /> },
  { label: 'Instagram', href: 'https://www.instagram.com/plmisiones/', icon: <Instagram className="h-6 w-6" /> },
  { label: 'YouTube', href: 'https://www.youtube.com/@partidolibertariomisiones', icon: <Youtube className="h-6 w-6" /> },
];

export function Footer() {
  const [modalNetwork, setModalNetwork] = React.useState<{ label: string; href: string; icon: JSX.Element } | null>(null);

  const handleSocialClick = (e: React.MouseEvent, network: typeof socialLinks[0]) => {
    e.preventDefault();
    setModalNetwork(network);
  };

  return (
    <>
      <footer className="bg-black/30 text-primary-foreground py-8 mt-auto backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex justify-center gap-6 mb-4">
            {socialLinks.map((social) => (
              <Link 
                key={social.label}
                href={social.href} 
                aria-label={social.label} 
                className="hover:text-primary transition-colors"
                onClick={(e) => handleSocialClick(e, social)}
              >
                {social.icon}
              </Link>
            ))}
          </div>
          <p className="font-body text-sm">
            &copy; {new Date().getFullYear()} Partido Libertario Misiones. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs mt-2">
            Hecho con <span role="img" aria-label="corazón">💙</span> por la libertad.
          </p>
          <div className="mt-6 border-t border-white/10 pt-4">
            <Link href="/admin" className="text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
              Administrador
            </Link>
          </div>
        </div>
      </footer>
      
      <Dialog open={!!modalNetwork} onOpenChange={(isOpen) => !isOpen && setModalNetwork(null)}>
        <DialogContent className="max-w-3xl w-full h-[80vh] p-2 flex flex-col bg-card">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-3 font-headline">
              <span className="text-primary">{modalNetwork?.icon}</span>
              {modalNetwork?.label}
            </DialogTitle>
          </DialogHeader>
          {modalNetwork && (
            <iframe
              src={modalNetwork.href}
              title={`Visitanos en ${modalNetwork.label}`}
              className="w-full h-full flex-grow border-0"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
