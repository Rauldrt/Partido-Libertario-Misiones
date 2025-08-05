
"use client";

import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { FilePlus, GalleryHorizontal, Info, LayoutDashboard, LayoutGrid, Link2, ListChecks, LogOut, PanelsTopLeft, Rss, Server, Sparkles, Star, Type } from 'lucide-react';
import Image from 'next/image';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FirebaseStatus } from '@/components/FirebaseStatus';

// This component now handles the auth protection logic.
function ProtectedAdminLayout({ children }: PropsWithChildren) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no user is logged in, redirect to the login page.
    // We also allow access to the login page itself to avoid a redirect loop.
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  // If we are on the login page, we don't want to render the admin layout.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show a loading screen while we verify the user's auth state.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verificando sesión...</p>
      </div>
    );
  }

  // If there's a user, render the full admin layout.
  return user ? (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
              <span className="font-headline text-lg">Admin Panel</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin">
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/ai-assistant">
                    <Sparkles />
                    Asistente de IA
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/news-generator">
                    <FilePlus />
                    Crear Contenido
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-content">
                    <ListChecks />
                    Gestionar Contenido
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-page-headers">
                    <Type />
                    Gestionar Encabezados
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-banner">
                    <GalleryHorizontal />
                    Gestionar Banner
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-accordion">
                    <PanelsTopLeft />
                    Gestionar Acordeón
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-mosaic">
                    <LayoutGrid />
                    Gestionar Mosaico
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-info-section">
                    <Info />
                    Gestionar Sección Info
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-referentes">
                    <Star />
                    Gestionar Referentes
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-social-widget">
                    <Rss />
                    Gestionar Widget Social
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-social-links">
                    <Link2 />
                    Gestionar Enlaces Sociales
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/manage-hosts">
                    <Server />
                    Gestionar Hosts
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
           <SidebarFooter>
              <Button variant="ghost" onClick={logout}>
                <LogOut />
                Cerrar Sesión
              </Button>
           </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-40">
             <SidebarTrigger className="md:hidden" />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">Panel de Administración</h1>
              </div>
              <FirebaseStatus />
          </header>
          <div className="p-4 sm:p-6">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ) : null; // Render nothing while redirecting
}

// The main export wraps the layout with the AuthProvider.
export default function AdminLayout({ children }: PropsWithChildren) {
    return (
        <AuthProvider>
            <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
        </AuthProvider>
    );
}
