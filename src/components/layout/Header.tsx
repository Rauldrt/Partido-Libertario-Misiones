
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, VoteIcon } from 'lucide-react'; // Using VoteIcon as a party symbol

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Quiénes Somos', href: '/about' },
  { label: 'Noticias y Eventos', href: '/news' },
  { label: 'Contacto', href: '/contact' },
];

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration mismatch for Sheet component
  }

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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6 bg-card">
              <div className="flex flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                  <VoteIcon className="h-8 w-8 text-primary" />
                  <span className="font-headline text-xl font-semibold text-primary">Misiones Libertad</span>
                </Link>
                {navItems.map((item) => (
                   <SheetClose asChild key={item.label}>
                    <Link
                      href={item.href}
                      className="font-body text-lg hover:text-primary py-2"
                    >
                      {item.label}
                    </Link>
                   </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
