
'use server';

import { z } from 'zod';
import { saveInfoSectionData } from '@/lib/homepage-service';
import { revalidatePath } from 'next/cache';

const InfoSectionSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  description: z.string().min(1, 'La descripción es requerida.'),
});

export async function saveInfoSectionDataAction(data: unknown) {
    const validation = InfoSectionSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        return { success: false, message: 'Datos inválidos. Por favor, revise todos los campos.' };
    }

    try {
        await saveInfoSectionData(validation.data);
        revalidatePath('/');
        
        return { success: true, message: '¡Sección guardada con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
