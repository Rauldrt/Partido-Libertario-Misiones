
import { getCandidates, saveCandidates } from '@/lib/dynamic-sections-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamEditorClient } from './TeamEditorClient';
import { revalidatePath } from 'next/cache';
import type { TeamMember } from '@/lib/dynamic-sections-service';

async function saveCandidatesAction(items: TeamMember[]) {
    'use server';
    try {
        await saveCandidates(items);
        revalidatePath('/');
        return { success: true, message: 'Candidatos guardados con éxito.' };
    } catch (e) {
        const error = e as Error;
        return { success: false, message: error.message };
    }
}

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
    
