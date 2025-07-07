
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText } from 'lucide-react';

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
            <CardTitle>Generador de Contenido</CardTitle>
            <CardDescription>Creá y publicá noticias o eventos en el sitio.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Usá la herramienta manual o la IA para generar artículos desde una URL.
            </p>
            <Button asChild>
              <Link href="/admin/news-generator">
                <FileText className="mr-2 h-4 w-4" />
                Ir al Generador
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
