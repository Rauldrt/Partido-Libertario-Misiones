
'use server';

import { z } from 'zod';
import { saveAccordionItems, type AccordionItemData } from '@/lib/homepage-service';
import { revalidatePath } from 'next/cache';

const AccordionItemSchema = z.object({
  id: z.string(),
  value: z.string(),
  title: z.string().min(1, 'El título es requerido.'),
  icon: z.string().min(1, 'El icono es requerido.'),
  content: z.string().min(1, 'El contenido es requerido.'),
});

const AccordionItemsSchema = z.array(AccordionItemSchema);


export async function saveAccordionItemsAction(data: AccordionItemData[]) {
    const validation = AccordionItemsSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        return { success: false, message: 'Datos inválidos. Por favor, revise todos los campos.' };
    }

    try {
        await saveAccordionItems(validation.data);
        revalidatePath('/');
        
        return { success: true, message: '¡Acordeón guardado con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
