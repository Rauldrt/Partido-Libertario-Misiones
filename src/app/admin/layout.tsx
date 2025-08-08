

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
import { FilePlus, GalleryHorizontal, Info, LayoutDashboard, LayoutGrid, Link2, ListChecks, LogOut, PanelsTopLeft, Rss, Server, Sparkles, Star, Type, Bell } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { FirebaseStatus } from '@/components/FirebaseStatus';

// This component no longer handles auth protection logic, as it's handled by the root layout.
// It just renders the admin-specific sidebar and header.
export default function AdminLayout({ children }: PropsWithChildren) {
    const { logout } = useAuth();
  
    return (
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
                    <Link href="/admin/manage-notification">
                        <Bell />
                        Gestionar Notificación
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
            <header className="flex h-14 items-center gap-4 border-b bg-purple-950/80 px-6 sticky top-0 z-40 backdrop-blur-md text-primary-foreground">
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
    );
}
