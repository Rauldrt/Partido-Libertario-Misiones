
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, VoteIcon, X } from 'lucide-react'; // Using VoteIcon as a party symbol, X for close
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import React from 'react';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Quiénes Somos', href: '/about' },
  { label: 'Noticias y Eventos', href: '/news' },
  { label: 'Contacto', href: '/contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <VoteIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-semibold text-primary">Misiones Libertad</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild>
              <Link href={item.href} className="font-body text-sm font-medium hover:text-primary">
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation - Android Style (Side Drawer) */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-card p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <VoteIcon className="h-7 w-7 text-primary" />
                    <span className="font-headline text-lg font-semibold text-primary">Misiones Libertad</span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Cerrar menú</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                  {navItems.map((item) => (
                    <SheetClose key={item.label} asChild>
                       <Link
                        href={item.href}
                        className="font-body text-base text-foreground hover:text-primary hover:bg-muted block px-3 py-2.5 rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="p-4 border-t mt-auto">
                  <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} Misiones Libertad</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
