
import { getBannerSlides } from '@/lib/homepage-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BannerEditorClient } from './BannerEditorClient';

export default async function ManageBannerPage() {
  const slides = await getBannerSlides();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Banner de Inicio</CardTitle>
        <CardDescription>
          Añade, elimina, reordena y edita las diapositivas del carrusel principal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BannerEditorClient initialSlides={slides} />
      </CardContent>
    </Card>
  );
}
