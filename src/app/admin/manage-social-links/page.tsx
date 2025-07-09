
import { getSocialLinks } from '@/lib/social-links-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialLinksEditorClient } from './SocialLinksEditorClient';

export default async function ManageSocialLinksPage() {
  const links = await getSocialLinks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Enlaces Sociales para Modales</CardTitle>
        <CardDescription>
          Modificá las URLs de inserción (embed) que se abren en una ventana modal al hacer clic en los íconos de redes sociales del encabezado y pie de página.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialLinksEditorClient initialLinks={links} />
      </CardContent>
    </Card>
  );
}
