
'use server';

import { z } from 'zod';
import { addNewsItem, updateNewsItem } from '@/lib/news-service';
import type { NewsCardData } from '@/lib/news-service';
import { revalidatePath } from 'next/cache';

// Simplified schema to only validate what's coming from the form,
// especially for new items. Let the backend service handle defaults.
const NewsItemFormSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
    summary: z.string().min(1, 'Summary is required'),
    imageUrl: z.string().url('Must be a valid URL'),
    type: z.enum(['news', 'event']),
    content: z.string().optional(),
    imageHint: z.string().optional(),
    youtubeVideoId: z.string().optional(),
    embedCode: z.string().optional(),
    published: z.boolean().optional(),
});

export async function saveNewsItemAction(data: Partial<NewsCardData>) {
    
    const validation = NewsItemFormSchema.safeParse(data);

    if (!validation.success) {
        console.error("Zod validation failed:", validation.error.issues);
        const errorMessages = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
        return { success: false, message: `Datos inválidos: ${errorMessages}`, errors: validation.error.issues };
    }

    try {
        const { id, ...saveData } = validation.data;

        if (id) {
            // This is an update
            await updateNewsItem(id, saveData);
            
            revalidatePath('/');
            revalidatePath('/news');
            revalidatePath(`/news/${id}`);
            revalidatePath('/admin/manage-content');
            
            return { success: true, message: '¡Contenido actualizado con éxito!' };
        } else {
            // This is a new item
            // Ensure 'published' is true for new items if not specified.
            const dataToSave = { ...saveData, published: saveData.published ?? true };
            await addNewsItem(dataToSave as any);
            
            revalidatePath('/');
            revalidatePath('/news');
            revalidatePath('/admin/manage-content');
            
            return { success: true, message: '¡Contenido guardado con éxito!' };
        }
    } catch (error) {
        console.error("Error saving news item:", error);
        return { success: false, message: (error as Error).message };
    }
}


export async function getNewsItemForEditAction(id: string) {
    try {
        const item = await getNewsItemById(id);
        if (!item) {
            return { success: false, message: 'Contenido no encontrado.' };
        }
        return { success: true, data: item };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
