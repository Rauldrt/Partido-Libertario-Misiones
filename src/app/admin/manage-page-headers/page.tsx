
import { getAllPageHeaders } from '@/lib/page-headers-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeadersEditorClient } from './PageHeadersEditorClient';

export default async function ManagePageHeadersPage() {
  const allHeaders = await getAllPageHeaders();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Encabezados de Página</CardTitle>
        <CardDescription>
          Edita el título, la descripción y el ícono principal de las páginas estáticas del sitio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PageHeadersEditorClient initialData={allHeaders} />
      </CardContent>
    </Card>
  );
}
