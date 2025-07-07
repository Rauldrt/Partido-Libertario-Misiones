
"use client";

import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 font-headline">
              <span className="text-primary">{modalNetwork?.icon}</span>
              Visitanos en {modalNetwork?.label}
            </DialogTitle>
            <DialogDescription className="font-body">
              Serás redirigido a nuestra página de {modalNetwork?.label} en una nueva pestaña.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
             <Button variant="outline" onClick={() => setModalNetwork(null)}>
                Cancelar
             </Button>
             <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href={modalNetwork?.href} target="_blank" rel="noopener noreferrer" onClick={() => setModalNetwork(null)}>
                    Continuar a {modalNetwork?.label}
                </a>
              </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
