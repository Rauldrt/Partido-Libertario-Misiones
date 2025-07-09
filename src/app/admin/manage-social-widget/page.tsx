
import { getSocialWidgetData } from '@/lib/widget-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WidgetEditorClient } from './WidgetEditorClient';

export default async function ManageSocialWidgetPage() {
  const widgetData = await getSocialWidgetData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Widget Social</CardTitle>
        <CardDescription>
          Modificá el contenido de la sección "Conectate en Redes".
          Podés usar el código de inserción (embed) de servicios como Elfsight, X (Twitter), etc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WidgetEditorClient initialData={widgetData} />
      </CardContent>
    </Card>
  );
}
