
import { getNewsItems } from '@/lib/news-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentTableClient } from './ContentTableClient';

export default async function ManageContentPage() {
  const newsItems = await getNewsItems();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Contenido</CardTitle>
        <CardDescription>
          Aquí puedes ver, ocultar, eliminar y reordenar las noticias y eventos existentes. Los cambios se reflejarán inmediatamente en el sitio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContentTableClient initialItems={newsItems} />
      </CardContent>
    </Card>
  );
}
