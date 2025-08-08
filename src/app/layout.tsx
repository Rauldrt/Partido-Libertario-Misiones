import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeManager } from '@/components/layout/ThemeManager';
import { SocialModalProvider } from '@/context/SocialModalContext';
import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';

// Metadata can still be defined in a client component, but it's often better at the page level.
// For a global layout, this is acceptable.
export const metadata: Metadata = {
  title: 'Partido Libertario Misiones',
  description: 'Página oficial del Partido Libertario de Misiones.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const isProtected = process.env.NEXT_PUBLIC_PROTECTED_SITE === 'true';

  return (
    <html lang="es">
      <head>
        <title>Partido Libertario Misiones</title>
        <meta name="description" content="Página oficial del Partido Libertario de Misiones." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-gradient-to-b from-black via-purple-950 to-fuchsia-500 overflow-x-hidden">
        <ThemeManager />
         <AuthProvider>
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
         </AuthProvider>
      </body>
    </html>
  );
}
