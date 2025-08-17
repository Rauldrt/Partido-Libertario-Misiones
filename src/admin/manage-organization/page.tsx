
import { getOrganization } from '@/lib/dynamic-sections-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamEditorClient } from '../shared/TeamEditorClient';
import type { TeamMember } from '@/lib/dynamic-sections-service';
import { saveOrganizationAction } from './actions';

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
    
