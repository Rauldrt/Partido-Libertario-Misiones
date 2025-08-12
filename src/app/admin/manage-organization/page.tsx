
import { getOrganization, saveOrganization } from '@/lib/dynamic-sections-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamEditorClient } from '../manage-candidates/TeamEditorClient'; // Reusing the editor client
import { revalidatePath } from 'next/cache';
import type { TeamMember } from '@/lib/dynamic-sections-service';

async function saveOrganizationAction(items: TeamMember[]) {
    'use server';
    try {
        await saveOrganization(items);
        revalidatePath('/');
        return { success: true, message: 'Organigrama guardado con éxito.' };
    } catch (e) {
        const error = e as Error;
        return { success: false, message: error.message };
    }
}

export default async function ManageOrganizationPage() {
  const items = await getOrganization();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Sección de Organigrama</CardTitle>
        <CardDescription>
          Añade, elimina, reordena y edita los miembros del organigrama que se muestran en la página de inicio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TeamEditorClient 
            initialItems={items} 
            saveAction={saveOrganizationAction}
            itemType="Miembro"
        />
      </CardContent>
    </Card>
  );
}
