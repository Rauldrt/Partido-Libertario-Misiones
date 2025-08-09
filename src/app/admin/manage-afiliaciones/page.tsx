
import { getAfiliacionSubmissions } from '@/lib/afiliacion-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AfiliacionesTable } from './AfiliacionesTable';

export default async function ManageAfiliacionesPage() {
  const submissions = await getAfiliacionSubmissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Afiliaciones</CardTitle>
        <CardDescription>
          Aquí puedes ver todas las solicitudes de afiliación enviadas desde el formulario del sitio web.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AfiliacionesTable initialData={submissions} />
      </CardContent>
    </Card>
  );
}
