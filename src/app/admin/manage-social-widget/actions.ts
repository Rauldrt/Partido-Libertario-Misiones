
'use server';

import { z } from 'zod';
import { saveSocialWidgetData } from '@/lib/widget-service';
import { revalidatePath } from 'next/cache';

const WidgetDataSchema = z.object({
  embedCode: z.string().trim(),
});

export async function saveSocialWidgetAction(data: { embedCode: string }) {
    const validation = WidgetDataSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, message: 'Datos inválidos.' };
    }

    try {
        await saveSocialWidgetData(validation.data);
        revalidatePath('/');
        revalidatePath('/news');
        
        return { success: true, message: '¡Widget social guardado con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
