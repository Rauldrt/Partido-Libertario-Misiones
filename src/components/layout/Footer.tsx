
"use client";

import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useSocialModal } from '@/context/SocialModalContext';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/PLMisiones/', icon: <Facebook className="h-6 w-6" /> },
  { label: 'Twitter', href: 'https://x.com/PLMisiones', icon: <Twitter className="h-6 w-6" /> },
  { label: 'Instagram', href: 'https://www.instagram.com/plmisiones/', icon: <Instagram className="h-6 w-6" /> },
  { label: 'YouTube', href: 'https://www.youtube.com/@partidolibertariomisiones', icon: <Youtube className="h-6 w-6" /> },
];

export function Footer() {
  const { openModal } = useSocialModal();

  const handleSocialClick = (e: React.MouseEvent, href: string, label: string) => {
    e.preventDefault();
    openModal(href, `Visitanos en ${label}`);
  };

  return (
    <>
      <footer className="bg-black/30 text-primary-foreground py-8 mt-auto backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex justify-center gap-6 mb-4">
            {socialLinks.map((social) => (
              <button 
                key={social.label}
                aria-label={social.label}
                className="hover:text-primary transition-colors"
                onClick={(e) => handleSocialClick(e, social.href, social.label)}
              >
                {social.icon}
              </button>
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
    </>
  );
}
