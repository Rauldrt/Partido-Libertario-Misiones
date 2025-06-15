
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
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
                <Link href={item.href} className="font-body text-sm font-medium">
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile FAB Menu */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              className="bg-gradient-to-br from-purple-800 to-cyan-500 text-white hover:from-purple-900 hover:to-cyan-600 group rounded-full w-16 h-16 shadow-xl hover:scale-105 active:scale-95 transition-all"
              aria-label="Abrir menú"
            >
              <Menu className="h-8 w-8 transition-transform duration-150 ease-in-out group-active:rotate-[15deg]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-card p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image src="/logo.png" alt="Partido Libertario Misiones Logo" width={28} height={28} />
                  <span className="font-headline text-lg font-semibold text-primary">Partido Libertario Misiones</span>
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
                <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} Partido Libertario Misiones</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
