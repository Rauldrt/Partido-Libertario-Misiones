import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeManager } from '@/components/layout/ThemeManager';
import { SocialModalProvider } from '@/context/SocialModalContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
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
