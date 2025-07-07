
import { getMosaicTiles } from '@/lib/homepage-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MosaicEditorClient } from './MosaicEditorClient';

export default async function ManageMosaicPage() {
  const tiles = await getMosaicTiles();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Mosaico de Imágenes</CardTitle>
        <CardDescription>
          Añade, elimina, reordena y edita los mosaicos de imágenes y sus slideshows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MosaicEditorClient initialTiles={tiles} />
      </CardContent>
    </Card>
  );
}
