
import { getInfoSectionData } from '@/lib/homepage-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoSectionEditorClient } from './InfoSectionEditorClient';

export default async function ManageInfoSectionPage() {
  const data = await getInfoSectionData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Títulos de la Sección "Info"</CardTitle>
        <CardDescription>
          Edita el título principal y el subtítulo que aparecen sobre el mosaico de imágenes en la página de inicio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InfoSectionEditorClient initialData={data} />
      </CardContent>
    </Card>
  );
}
