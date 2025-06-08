import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="#" aria-label="Facebook" className="hover:text-primary transition-colors">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" aria-label="Instagram" className="hover:text-primary transition-colors">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" aria-label="YouTube" className="hover:text-primary transition-colors">
            <Youtube className="h-6 w-6" />
          </Link>
        </div>
        <p className="font-body text-sm">
          &copy; {new Date().getFullYear()} Misiones Libertad. Todos los derechos reservados.
        </p>
        <p className="font-body text-xs mt-2">
          Hecho con <span role="img" aria-label="corazón">💙</span> por la libertad.
        </p>
      </div>
    </footer>
  );
}
