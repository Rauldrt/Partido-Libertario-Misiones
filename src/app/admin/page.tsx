
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FilePlus, GalleryHorizontal, LayoutGrid, ListChecks, Server } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bienvenido al Panel de Administración</h2>
      <p className="text-muted-foreground mb-8">
        Desde aquí podés gestionar el contenido y las herramientas del sitio.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Crear Contenido</CardTitle>
            <CardDescription>Creá y publicá noticias o eventos en el sitio.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Usá la herramienta manual o la IA para generar artículos desde una URL.
            </p>
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
            <p className="mb-4 text-sm text-muted-foreground">
              Administrá la visibilidad y el ciclo de vida de tus publicaciones.
            </p>
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
            <CardTitle>Gestionar Banner</CardTitle>
            <CardDescription>Editá, reordená y eliminá las diapositivas del banner principal.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Controlá el contenido que se muestra en el carrusel de la página de inicio.
            </p>
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
            <CardTitle>Gestionar Mosaico</CardTitle>
            <CardDescription>Editá los mosaicos de imágenes y sus animaciones.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Personalizá la galería de imágenes animadas de la página de inicio.
            </p>
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
            <CardTitle>Gestionar Hosts de Imágenes</CardTitle>
            <CardDescription>Añade los dominios desde los que se pueden cargar imágenes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Edita la configuración de Next.js para permitir nuevos hosts de imágenes.
            </p>
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
  );
}
