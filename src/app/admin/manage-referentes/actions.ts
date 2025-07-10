
'use server';

import { z } from 'zod';
import { saveReferentes, type ReferenteData } from '@/lib/referentes-service';
import { revalidatePath } from 'next/cache';

const ReferenteSchema = z.object({
  id: z.string(), // Keep ID for client-side state management, but it will be stripped before saving
  locality: z.string().min(1, 'La localidad es requerida.'),
  name: z.string().min(1, 'El nombre es requerido.'),
  phone: z.string().regex(/^[0-9]+$/, 'El teléfono solo debe contener números.').min(10, 'El teléfono debe tener al menos 10 dígitos.'),
});

const ReferentesListSchema = z.array(ReferenteSchema);

export async function saveReferentesAction(data: ReferenteData[]) {
    const validation = ReferentesListSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        return { success: false, message: 'Datos inválidos. Por favor, revise todos los campos.' };
    }

    try {
        await saveReferentes(validation.data);
        revalidatePath('/referentes');
        
        return { success: true, message: '¡Referentes guardados con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
