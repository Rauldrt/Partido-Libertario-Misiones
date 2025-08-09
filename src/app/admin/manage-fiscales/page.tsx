
import { getFiscalizacionSubmissions } from '@/lib/fiscalizacion-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FiscalesTable } from './FiscalesTable';

export default async function ManageFiscalesPage() {
  const submissions = await getFiscalizacionSubmissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Inscriptos para Fiscalización</CardTitle>
        <CardDescription>
          Aquí puedes ver todos los voluntarios inscriptos desde el formulario del sitio web.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FiscalesTable initialData={submissions} />
      </CardContent>
    </Card>
  );
}
