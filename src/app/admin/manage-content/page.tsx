
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
          Aquí puedes ver, ocultar o eliminar las noticias y eventos existentes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContentTableClient initialItems={newsItems} />
      </CardContent>
    </Card>
  );
}
