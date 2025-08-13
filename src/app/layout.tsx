import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeManager } from '@/components/layout/ThemeManager';
import { SocialModalProvider } from '@/context/SocialModalContext';
import { AuthProvider } from '@/context/AuthContext';
import { Poppins, PT_Sans } from 'next/font/google';
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['600', '700'] // Semibold, Bold
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
  weight: ['400', '700'] // Regular, Bold
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="es" className={`${poppins.variable} ${ptSans.variable}`}>
      <head>
        <title>Partido Libertario Misiones</title>
        <meta name="description" content="Página oficial del Partido Libertario de Misiones." />
        <meta name="theme-color" content="#29ABE2" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
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
         <Script id="service-worker-registration">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                  console.log('Service Worker registrado con éxito:', registration);
                }).catch(error => {
                  console.log('Error al registrar el Service Worker:', error);
                });
              });
            }
          `}
         </Script>
      </body>
    </html>
  );
}
