
"use client";

import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useSocialModal } from '@/context/SocialModalContext';
import { getSocialLinks, type SocialLink } from '@/lib/social-links-service';

const iconMap: { [key: string]: React.ReactNode } = {
  facebook: <Facebook className="h-6 w-6" />,
  x: <Twitter className="h-6 w-6" />,
  instagram: <Instagram className="h-6 w-6" />,
  youtube: <Youtube className="h-6 w-6" />,
};

export function Footer() {
  const { openModal } = useSocialModal();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    // Fetch links on the client side since this is a client component
    getSocialLinks().then(setSocialLinks);
  }, []);

  const handleSocialClick = (e: React.MouseEvent, link: SocialLink) => {
    e.preventDefault();
    if (!link.embedCode) return;
    openModal({
      content: link.embedCode,
      title: `Visitanos en ${link.label}`,
    });
  };

  return (
    <>
      <footer className="bg-black/30 text-primary-foreground py-8 mt-auto backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex justify-center gap-6 mb-4">
            {socialLinks.map((social) => (
              <button 
                key={social.id}
                aria-label={social.label}
                className="hover:text-primary transition-colors"
                onClick={(e) => handleSocialClick(e, social)}
              >
                {iconMap[social.id] || social.label}
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
