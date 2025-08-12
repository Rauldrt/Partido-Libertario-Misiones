
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FilePlus, GalleryHorizontal, Info, LayoutGrid, Link2, ListChecks, MessageSquare, PanelsTopLeft, Rss, Server, Sparkles, Star, Type, Bell, UserCheck, ShieldCheckIcon, Users, Library, Wrench, Newspaper, Brush, Component } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

const SectionTitle = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-4 mt-8 col-span-1 md:col-span-2 lg:col-span-3">
        {icon}
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
    </div>
);


export default function AdminDashboardPage() {
  return (
    <TooltipProvider>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
              <h2 className="text-2xl font-bold">Bienvenido al Panel de Administración</h2>
              <p className="text-muted-foreground mt-1">
                Desde aquí podés gestionar el contenido y las herramientas del sitio.
              </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            <SectionTitle title="Formularios y Envíos" icon={<Wrench className="h-6 w-6 text-primary" />} />

            <Card>
                <CardHeader>
                <CardTitle>Ver Afiliaciones</CardTitle>
                <CardDescription>Revisá los datos de las personas que se afilian.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-afiliaciones">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Ver Afiliados
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Ver Fiscales</CardTitle>
                <CardDescription>Revisá los datos de los inscriptos para fiscalizar.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-fiscales">
                    <ShieldCheckIcon className="mr-2 h-4 w-4" />
                    Ver Fiscales
                    </Link>
                </Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                <CardTitle>Ver Contactos</CardTitle>
                <CardDescription>Revisá los mensajes enviados desde la página de contacto.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-contact">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ver Mensajes
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Editor de Formularios</CardTitle>
                    <CardDescription>Personalizá los campos de los formularios públicos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/admin/manage-forms">
                            <Component className="mr-2 h-4 w-4" />
                            Editar Formularios
                        </Link>
                    </Button>
                </CardContent>
            </Card>
            
            <SectionTitle title="Contenido y Publicaciones" icon={<Newspaper className="h-6 w-6 text-primary" />} />

            <Card>
                <CardHeader>
                <CardTitle>Crear Contenido</CardTitle>
                <CardDescription>Creá y publicá noticias o eventos en el sitio.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/news-generator">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Ir al Creador
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Gestionar Contenido</CardTitle>
                <CardDescription>Editá, ocultá o eliminá noticias y eventos.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-content">
                    <ListChecks className="mr-2 h-4 w-4" />
                    Ir al Gestor
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Asistente de IA</CardTitle>
                <CardDescription>Interactuá con una IA para generar y mejorar contenido.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/ai-assistant">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ir al Asistente
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <SectionTitle title="Apariencia de la Página Principal" icon={<Brush className="h-6 w-6 text-primary" />} />

             <Card>
                <CardHeader>
                <CardTitle>Gestionar Banner</CardTitle>
                <CardDescription>Editá, reordená y eliminá las diapositivas del banner.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-banner">
                    <GalleryHorizontal className="mr-2 h-4 w-4" />
                    Editar Banner
                    </Link>
                </Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                <CardTitle>Gestionar Acordeón</CardTitle>
                <CardDescription>Edita los paneles informativos (Misión, Visión, etc.).</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-accordion">
                    <PanelsTopLeft className="mr-2 h-4 w-4" />
                    Editar Acordeón
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Gestionar Mosaico</CardTitle>
                <CardDescription>Editá los mosaicos de imágenes y sus animaciones.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-mosaic">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Editar Mosaico
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Gestionar Sección Info</CardTitle>
                <CardDescription>Edita el título y subtítulo de la sección "Info".</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-info-section">
                    <Info className="mr-2 h-4 w-4" />
                    Editar Sección
                    </Link>
                </Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                <CardTitle>Gestionar Notificación</CardTitle>
                <CardDescription>Controla la burbuja de notificación en el banner.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-notification">
                    <Bell className="mr-2 h-4 w-4" />
                    Editar Notificación
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <SectionTitle title="Estructura del Partido" icon={<Library className="h-6 w-6 text-primary" />} />
            
             <Card>
                <CardHeader>
                <CardTitle>Gestionar Candidatos</CardTitle>
                <CardDescription>Edita la sección de candidatos en la página principal.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-candidates">
                    <Users className="mr-2 h-4 w-4" />
                    Editar Candidatos
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Gestionar Organigrama</CardTitle>
                <CardDescription>Edita el organigrama del partido en la página principal.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-organization">
                    <Library className="mr-2 h-4 w-4" />
                    Editar Organigrama
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Gestionar Referentes</CardTitle>
                <CardDescription>Añadí, editá y eliminá los referentes del partido.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-referentes">
                    <Star className="mr-2 h-4 w-4" />
                    Editar Referentes
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <SectionTitle title="Configuración General del Sitio" icon={<Server className="h-6 w-6 text-primary" />} />
            
            <Card>
                <CardHeader>
                <CardTitle>Gestionar Encabezados</CardTitle>
                <CardDescription>Edita los títulos de las páginas estáticas.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-page-headers">
                    <Type className="mr-2 h-4 w-4" />
                    Editar Encabezados
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Gestionar Enlaces Sociales</CardTitle>
                <CardDescription>Edita las URLs de los modales de redes sociales.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-social-links">
                    <Link2 className="mr-2 h-4 w-4" />
                    Gestionar Enlaces
                    </Link>
                </Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                <CardTitle>Gestionar Widget Social</CardTitle>
                <CardDescription>Modificá el contenido del widget de redes.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-social-widget">
                    <Rss className="mr-2 h-4 w-4" />
                    Gestionar Widget
                    </Link>
                </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Gestionar Hosts de Imágenes</CardTitle>
                <CardDescription>Añade los dominios para cargar imágenes.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild>
                    <Link href="/admin/manage-hosts">
                    <Server className="mr-2 h-4 w-4" />
                    Gestionar Hosts
                    </Link>
                </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
