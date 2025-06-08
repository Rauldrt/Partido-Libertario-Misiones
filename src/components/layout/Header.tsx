
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, VoteIcon } from 'lucide-react'; // Using VoteIcon as a party symbol
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Quiénes Somos', href: '/about' },
  { label: 'Noticias y Eventos', href: '/news' },
  { label: 'Contacto', href: '/contact' },
];

export function Header() {
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56"> {/* Adjusted width for dropdown */}
              {navItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link
                    href={item.href}
                    className="font-body text-base hover:text-primary w-full block px-2 py-1.5" // Adjusted styling for dropdown item
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
