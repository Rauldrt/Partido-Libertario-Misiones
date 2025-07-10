
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ManageReferentesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Referentes</CardTitle>
        <CardDescription>
          Añade, edita, reordena y elimina los referentes del partido que se muestran en la página pública.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Funcionalidad de gestión de referentes en desarrollo.</p>
        </div>
      </CardContent>
    </Card>
  );
}
