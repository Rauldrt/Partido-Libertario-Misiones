
import { getAccordionItems } from '@/lib/homepage-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccordionEditorClient } from './AccordionEditorClient';

export default async function ManageAccordionPage() {
  const items = await getAccordionItems();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Acordeón de Inicio</CardTitle>
        <CardDescription>
          Añade, elimina, reordena y edita los paneles del acordeón principal (Misión, Visión, etc.).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AccordionEditorClient initialItems={items} />
      </CardContent>
    </Card>
  );
}
