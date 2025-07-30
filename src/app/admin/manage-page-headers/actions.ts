
'use server';

import { z } from 'zod';
import { saveAllPageHeaders } from '@/lib/page-headers-service';
import { revalidatePath } from 'next/cache';

const PageHeaderSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  description: z.string().min(1, 'La descripción es requerida.'),
  icon: z.string().min(1, 'El ícono es requerido.'),
  backgroundImage: z.string().optional(),
  featuredImage: z.string().optional(),
  featuredImageTitle: z.string().optional(),
});

const AllHeadersSchema = z.record(z.string(), PageHeaderSchema);

export async function savePageHeadersAction(data: unknown) {
    const validation = AllHeadersSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        return { success: false, message: 'Datos inválidos. Por favor, revise todos los campos.' };
    }

    try {
        await saveAllPageHeaders(validation.data);
        revalidatePath('/');
        revalidatePath('/news');
        revalidatePath('/about');
        revalidatePath('/referentes');
        revalidatePath('/contact');
        revalidatePath('/afiliacion');
        revalidatePath('/fiscalizacion');
        
        return { success: true, message: '¡Encabezados guardados con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
