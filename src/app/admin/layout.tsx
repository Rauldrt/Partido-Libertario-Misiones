
"use client";

import { type PropsWithChildren, useEffect } from 'react';
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { FilePlus, GalleryHorizontal, Info, LayoutDashboard, LayoutGrid, Link2, ListChecks, LogOut, PanelsTopLeft, Rss, Server, Sparkles, Star, Type, Bell, UserCheck, ShieldCheckIcon, MessageSquare, Wrench, Users, Library, Component, Newspaper, Brush } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { FirebaseStatus } from '@/components/FirebaseStatus';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';


export default function AdminLayout({ children }: PropsWithChildren) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">Verificando acceso...</p>
            </div>
        );
    }
    
    // Allow login page to render without the admin layout
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Don't render anything if there's no user and we are about to redirect.
    if (!user) {
        return null;
    }
  
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

                        {/* --- Grupo: Formularios y Envíos --- */}
                        <SidebarMenuItem>
                             <SidebarMenuButton>
                                <Wrench />
                                <span>Formularios</span>
                            </SidebarMenuButton>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-afiliaciones"><UserCheck/>Afiliaciones</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-fiscales"><ShieldCheckIcon/>Fiscales</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-contact"><MessageSquare/>Contactos</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                 <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-forms"><Component/>Editor de Formularios</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </SidebarMenuItem>
                        
                        {/* --- Grupo: Contenido y Publicaciones --- */}
                         <SidebarMenuItem>
                             <SidebarMenuButton>
                                <Newspaper />
                                <span>Contenido</span>
                            </SidebarMenuButton>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/news-generator"><FilePlus/>Crear Contenido</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-content"><ListChecks/>Gestionar Contenido</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/ai-assistant"><Sparkles/>Asistente IA</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </SidebarMenuItem>

                        {/* --- Grupo: Apariencia Home --- */}
                         <SidebarMenuItem>
                             <SidebarMenuButton>
                                <Brush />
                                <span>Apariencia Home</span>
                            </SidebarMenuButton>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-banner"><GalleryHorizontal/>Banner</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-accordion"><PanelsTopLeft/>Acordeón</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-mosaic"><LayoutGrid/>Mosaico</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-info-section"><Info/>Sección Info</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-notification"><Bell/>Notificación</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </SidebarMenuItem>

                         {/* --- Grupo: Estructura del Partido --- */}
                         <SidebarMenuItem>
                             <SidebarMenuButton>
                                <Library />
                                <span>Estructura Partido</span>
                            </SidebarMenuButton>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-candidates"><Users/>Candidatos</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-organization"><Library/>Organigrama</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-referentes"><Star/>Referentes</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </SidebarMenuItem>
                        
                        {/* --- Grupo: Configuración General --- */}
                         <SidebarMenuItem>
                             <SidebarMenuButton>
                                <Server />
                                <span>Configuración General</span>
                            </SidebarMenuButton>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-page-headers"><Type/>Encabezados de Página</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-social-links"><Link2/>Enlaces Sociales</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                 <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-social-widget"><Rss/>Widget Social</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild><Link href="/admin/manage-hosts"><Server/>Hosts de Imágenes</Link></SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
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
                <header className="flex h-14 items-center gap-4 border-b bg-sidebar px-6 sticky top-0 z-40 text-sidebar-foreground backdrop-blur-md">
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
