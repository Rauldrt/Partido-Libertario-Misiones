
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormEditorClient } from './FormEditorClient';
import { getFormDefinition } from '@/lib/afiliacion-service';

export default async function ManageFormsPage() {
  const afiliacionDef = await getFormDefinition('afiliacion');
  const fiscalizacionDef = await getFormDefinition('fiscalizacion');
  // Add other form defs here as needed

  const initialForms = {
    afiliacion: afiliacionDef,
    fiscalizacion: fiscalizacionDef,
    // contacto: ...
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Campos de Formularios</CardTitle>
        <CardDescription>
          Añadí, reordená, editá y eliminá los campos que aparecen en los formularios públicos del sitio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormEditorClient initialForms={initialForms} />
      </CardContent>
    </Card>
  );
}
