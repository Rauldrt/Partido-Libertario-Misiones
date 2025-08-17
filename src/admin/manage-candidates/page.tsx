
import { getCandidates } from '@/lib/dynamic-sections-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamEditorClient } from '../shared/TeamEditorClient';
import { saveCandidatesAction } from './actions';

export default async function ManageCandidatesPage() {
  const items = await getCandidates();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Sección de Candidatos</CardTitle>
        <CardDescription>
          Añade, elimina, reordena y edita los candidatos que se muestran en la página de inicio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TeamEditorClient 
            initialItems={items} 
            saveAction={saveCandidatesAction}
            itemType="Candidato"
        />
      </CardContent>
    </Card>
  );
}
    
