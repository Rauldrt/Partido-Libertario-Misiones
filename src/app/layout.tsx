
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeManager } from '@/components/layout/ThemeManager';
import { SocialModalProvider } from '@/context/SocialModalContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Metadata can still be defined in a client component, but it's often better at the page level.
// For a global layout, this is acceptable.
export const metadata: Metadata = {
  title: 'Partido Libertario Misiones',
  description: 'Página oficial del Partido Libertario de Misiones.',
};


function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth is done loading and there's no user, redirect to login page.
    // We must allow access to the login page itself to prevent a redirect loop.
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  // If we are on the login page, render it without the main layout.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // While checking auth state, show a global loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verificando acceso...</p>
      </div>
    );
  }

  // If a user is logged in, render the full application layout.
  return user ? (
    <SocialModalProvider>
      <div className="flex-grow flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
    </SocialModalProvider>
  ) : null; // Render nothing while redirecting
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-gradient-to-b from-black via-purple-950 to-fuchsia-500 overflow-x-hidden">
        <ThemeManager />
         <AuthProvider>
            <ProtectedAppLayout>{children}</ProtectedAppLayout>
         </AuthProvider>
      </body>
    </html>
  );
}
