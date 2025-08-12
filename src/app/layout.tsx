import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeManager } from '@/components/layout/ThemeManager';
import { SocialModalProvider } from '@/context/SocialModalContext';
import { AuthProvider } from '@/context/AuthContext';
import { Montserrat, Roboto } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['800'] // ExtraBold
});

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['300', '400', '700'] // Light, Regular, Bold
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="es" className={`${montserrat.variable} ${roboto.variable}`}>
      <head>
        <title>Misiones Libertad</title>
        <meta name="description" content="Página oficial del Partido Libertario de Misiones." />
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
      </body>
    </html>
  );
}
