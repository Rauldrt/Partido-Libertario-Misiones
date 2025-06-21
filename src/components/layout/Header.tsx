
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, Home, Users, Newspaper, MailIcon as Mail, X, Facebook, Twitter, Instagram, Youtube, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import React from 'react';

const navItems = [
  { label: 'Inicio', href: '/', icon: <Home className="mr-2 h-5 w-5" /> },
  { label: 'Quiénes Somos', href: '/about', icon: <Users className="mr-2 h-5 w-5" /> },
  { label: 'Noticias y Eventos', href: '/news', icon: <Newspaper className="mr-2 h-5 w-5" /> },
  { label: 'Contacto', href: '/contact', icon: <Mail className="mr-2 h-5 w-5" /> },
];

const socialLinks = [
  { label: 'Facebook', href: '#', icon: <Facebook className="h-6 w-6" /> },
  { label: 'Twitter', href: '#', icon: <Twitter className="h-6 w-6" /> },
  { label: 'Instagram', href: '#', icon: <Instagram className="h-6 w-6" /> },
  { label: 'YouTube', href: '#', icon: <Youtube className="h-6 w-6" /> },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <header className="relative text-primary-foreground shadow-md sticky top-0 z-50">
        {/* Background Image Layer (z-0) - Full Opacity */}
        <Image 
          src="/banner3.jpg"
          alt="Navbar background pattern" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0 z-0"
          data-ai-hint="abstract pattern"
          priority
        />
        {/* Gradient Overlay Layer (z-10) - Slight Opacity */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-purple-800/70 to-orange-500/70"></div>

        {/* Content Layer (z-20) */}
        <div className="relative z-20 container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Partido Libertario Misiones Logo" width={42} height={42} />
            <span className="font-headline text-xl font-semibold">Partido Libertario Misiones</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Button key={item.label} variant="ghost" asChild>
                <Link href={item.href} className="font-body text-base font-medium hover:scale-105 transform transition-transform duration-150 ease-in-out">
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile FAB Menu */}
      <div className="md:hidden fixed bottom-12 right-12 z-50">
        <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-gradient-to-br from-purple-700 via-orange-500 to-yellow-400 text-white hover:from-purple-800 hover:to-orange-600 group rounded-full w-16 h-16 shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/75 btn-ripple"
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
            className="w-72 bg-[rgba(88,28,135,0.95)] shadow-xl rounded-lg p-2" 
          >
            {navItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild className="cursor-pointer">
                <Link
                  href={item.href}
                  className="flex items-center p-4 text-base font-medium text-primary-foreground hover:bg-white/10 rounded-md" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {React.cloneElement(item.icon, { className: "mr-3 h-6 w-6"})}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-1 bg-white/20" />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href="/afiliacion"
                className="flex items-center p-4 text-base font-semibold text-accent hover:bg-white/10 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserPlus className="mr-3 h-6 w-6" />
                Afiliate
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-white/20" />
            <div className="flex justify-around items-center py-2 px-2">
              {socialLinks.map((social) => (
                <Link 
                  key={social.label} 
                  href={social.href} 
                  aria-label={social.label}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-2 rounded-full hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {React.cloneElement(social.icon, { className: "h-7 w-7" })}
                </Link>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
