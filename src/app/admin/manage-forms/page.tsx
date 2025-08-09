
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormEditorClient } from './FormEditorClient';

export default function ManageFormsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Campos de Formularios</CardTitle>
        <CardDescription>
          Añadí, reordená, editá y eliminá los campos que aparecen en los formularios públicos del sitio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormEditorClient />
      </CardContent>
    </Card>
  );
}
