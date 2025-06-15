
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, Home, Users, Newspaper, MailIcon as Mail } from 'lucide-react'; // Renamed Mail to MailIcon to avoid conflict
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from 'react';

const navItems = [
  { label: 'Inicio', href: '/', icon: <Home className="mr-2 h-5 w-5" /> },
  { label: 'Quiénes Somos', href: '/about', icon: <Users className="mr-2 h-5 w-5" /> },
  { label: 'Noticias y Eventos', href: '/news', icon: <Newspaper className="mr-2 h-5 w-5" /> },
  { label: 'Contacto', href: '/contact', icon: <Mail className="mr-2 h-5 w-5" /> },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-purple-800 to-orange-500 text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Partido Libertario Misiones Logo" width={42} height={42} />
            <span className="font-headline text-xl font-semibold">Partido Libertario Misiones</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Button key={item.label} variant="ghost" asChild>
                <Link href={item.href} className="font-body text-sm font-medium hover:scale-105 transform transition-transform duration-150 ease-in-out">
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile FAB Menu */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-gradient-to-br from-purple-800 to-cyan-500 text-white hover:from-purple-900 hover:to-cyan-600 group rounded-full w-16 h-16 shadow-xl hover:scale-105 active:scale-95 transition-all"
              aria-label="Abrir menú"
            >
              <Menu className="h-8 w-8 transition-transform duration-150 ease-in-out group-active:rotate-[15deg]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="top" 
            align="end" 
            sideOffset={10}
            className="w-56 bg-card shadow-xl rounded-lg p-2"
          >
            {navItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild className="cursor-pointer">
                <Link
                  href={item.href}
                  className="flex items-center p-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
