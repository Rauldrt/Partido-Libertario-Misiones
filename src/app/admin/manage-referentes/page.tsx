
import { getReferentes } from '@/lib/referentes-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReferentesEditorClient } from './ReferentesEditorClient';

export default async function ManageReferentesPage() {
  const referentes = await getReferentes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Referentes</CardTitle>
        <CardDescription>
          Añade, edita, reordena y elimina los referentes del partido que se muestran en la página pública.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReferentesEditorClient initialReferentes={referentes} />
      </CardContent>
    </Card>
  );
}
