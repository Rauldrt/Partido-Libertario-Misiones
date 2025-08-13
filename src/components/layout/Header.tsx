
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, Home, Users, Newspaper, MailIcon as Mail, X, Facebook, Twitter, Instagram, Youtube, UserPlus, ShieldCheck, Star, ChevronDown, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from 'react';
import { useSocialModal } from '@/context/SocialModalContext';
import { getSocialLinks, type SocialLink } from '@/lib/social-links-service';

const navItems = [
  { label: 'Inicio', href: '/', icon: <Home className="mr-2 h-5 w-5" /> },
  { label: 'Noticias y Eventos', href: '/news', icon: <Newspaper className="mr-2 h-5 w-5" /> },
];

const dropdownNavItems = [
    { label: 'Quiénes Somos', href: '/about', icon: <Users className="mr-2 h-5 w-5" /> },
    { label: 'Nuestros Referentes', href: '/referentes', icon: <Star className="mr-2 h-5 w-5" /> },
    { label: 'Contacto', href: '/contact', icon: <Mail className="mr-2 h-5 w-5" /> },
    { label: 'Administrador', href: '/admin', icon: <LayoutDashboard className="mr-2 h-5 w-5" /> },
]

const iconMap: { [key: string]: React.ReactNode } = {
  facebook: <Facebook className="h-7 w-7" />,
  x: <Twitter className="h-7 w-7" />,
  instagram: <Instagram className="h-7 w-7" />,
  youtube: <Youtube className="h-7 w-7" />,
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { openModal } = useSocialModal();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    getSocialLinks().then(setSocialLinks);
  }, []);

  const handleSocialClick = (e: React.MouseEvent, link: SocialLink) => {
    e.preventDefault();
    if (!link.embedCode) return;
    openModal({
      content: link.embedCode,
      title: `Visitanos en ${link.label}`,
    });
    setIsMobileMenuOpen(false);
  };


  return (
    <>
      <header className="relative text-primary-foreground shadow-md sticky top-0 z-50">
        {/* Background Layer (z-10) */}
        <div className="absolute inset-0 z-10 bg-[#572364]"></div>

        {/* Content Layer (z-20) */}
        <div className="relative z-20 container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
            <div className="flex-shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Partido Libertario Misiones Logo" width={64} height={64} />
                </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-center">
                <Link href="/">
                    <span className="font-headline text-lg md:text-xl font-semibold whitespace-nowrap">Partido Libertario Misiones</span>
                </Link>
            </div>

            <div className="hidden md:flex flex-shrink-0 items-center justify-end">
                <nav className="flex items-center gap-2">
                    {navItems.map((item) => (
                    <Button 
                        key={item.label} 
                        variant="ghost" 
                        asChild 
                        className="font-body text-base font-medium transition-all duration-300 hover:scale-105 hover:text-primary hover:bg-[#4a1d54] hover:shadow-[0_0_8px_hsl(var(--primary)/0.7)]"
                    >
                        <Link href={item.href}>
                            {item.label}
                        </Link>
                    </Button>
                    ))}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="font-body text-base font-medium transition-all duration-300 hover:scale-105 hover:text-primary hover:bg-[#4a1d54] hover:shadow-[0_0_8px_hsl(var(--primary)/0.7)]">
                                Más
                                <ChevronDown className="relative top-[1px] ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-sm border-white/20 text-foreground">
                            {dropdownNavItems.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link href={item.href} className="flex items-center">
                                        {item.icon} {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="border-l border-white/20 h-8 mx-2"></div>
                    <Button asChild className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-primary-foreground hover:from-orange-600 hover:to-amber-600 shadow-md transition-transform hover:scale-105">
                        <Link href="/fiscalizacion">
                            <ShieldCheck className="mr-2 h-5 w-5" />
                            <span>Fiscalizá</span>
                        </Link>
                    </Button>
                    <Button asChild className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-primary-foreground hover:from-cyan-600 hover:to-purple-600 shadow-md transition-transform hover:scale-105">
                        <Link href="/afiliacion">
                            <UserPlus className="mr-2 h-5 w-5" />
                            <span>Afiliate</span>
                        </Link>
                    </Button>
                </nav>
            </div>

            {/* Mobile-only Title */}
             <div className="md:hidden flex-1 flex justify-center items-center">
                <Link href="/">
                    <span className="font-headline text-lg font-semibold whitespace-nowrap">Partido Libertario Misiones</span>
                </Link>
            </div>
        </div>
      </header>

      {/* Mobile FAB Menu */}
      <div className="md:hidden fixed bottom-12 right-12 z-50">
        <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="relative bg-gradient-to-br from-purple-950 to-orange-600 text-white hover:from-purple-950 hover:to-orange-600 group rounded-full w-16 h-16 shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/75"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? (
                <X className="h-10 w-10 transition-transform duration-150 ease-in-out" />
              ) : (
                <Menu className="h-10 w-10 transition-transform duration-150 ease-in-out group-active:rotate-[90deg]" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="top" 
            align="end" 
            sideOffset={12}
            className="w-72 bg-destructive text-destructive-foreground backdrop-blur-md shadow-xl rounded-lg p-2 border border-accent/50" 
          >
            {navItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild className="cursor-pointer">
                <Link
                  href={item.href}
                  className="flex items-center p-4 text-base font-medium text-destructive-foreground hover:bg-white/10 rounded-md" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {React.cloneElement(item.icon, { className: "mr-3 h-6 w-6"})}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-1 bg-white/20" />
            {dropdownNavItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild className="cursor-pointer">
                <Link
                  href={item.href}
                  className="flex items-center p-4 text-base font-medium text-destructive-foreground hover:bg-white/10 rounded-md" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {React.cloneElement(item.icon, { className: "mr-3 h-6 w-6"})}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-1 bg-white/20" />
            <div className="px-2 py-1.5 space-y-2">
                <Button asChild className="w-full text-primary-foreground shadow-md rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
                    <Link
                        href="/fiscalizacion"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        <span>Fiscalizá</span>
                    </Link>
                </Button>
                <Button asChild className="w-full text-primary-foreground shadow-md rounded-full bg-gradient-to-r from-cyan-500 to-purple-500">
                    <Link
                        href="/afiliacion"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <UserPlus className="mr-2 h-5 w-5" />
                        <span>Afiliate</span>
                    </Link>
                </Button>
            </div>
            <DropdownMenuSeparator className="my-1 bg-white/20" />
            <div className="flex justify-around items-center py-2 px-2">
              {socialLinks.map((social) => (
                <button 
                  key={social.id} 
                  aria-label={social.label}
                  className="text-destructive-foreground/80 hover:text-destructive-foreground transition-colors p-2 rounded-full hover:bg-white/10"
                  onClick={(e) => handleSocialClick(e, social)}
                >
                  {iconMap[social.id] || social.label}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
