
'use server';

import { z } from 'zod';
import { addNewsItem, getNewsItemById, updateNewsItem } from '@/lib/news-service';
import type { NewsCardData } from '@/lib/news-service';
import { revalidatePath } from 'next/cache';

// Base schema for the core fields
const BaseNewsSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
    summary: z.string().min(1, 'Summary is required'),
    imageUrl: z.string().url('Must be a valid URL'),
    type: z.enum(['news', 'event']),
    content: z.string().optional(),
    imageHint: z.string().optional(),
    youtubeVideoId: z.string().optional(),
    embedCode: z.string().optional(),
});

// Schema for creating a new item. `published` is optional and defaults to true.
const CreateNewsSchema = BaseNewsSchema.extend({
    published: z.boolean().optional(),
});

// Schema for updating an item. `id` is required.
const UpdateNewsSchema = BaseNewsSchema.extend({
    id: z.string(),
    published: z.boolean().optional(),
});

export async function saveNewsItemAction(data: Partial<NewsCardData>) {
    
    if (data.id) {
        // This is an UPDATE
        const validation = UpdateNewsSchema.safeParse(data);
        if (!validation.success) {
            console.error("Zod update validation failed:", validation.error.issues);
            const errorMessages = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
            return { success: false, message: `Datos inválidos: ${errorMessages}` };
        }
        try {
            await updateNewsItem(validation.data.id, validation.data);
            revalidatePath('/');
            revalidatePath('/news');
            revalidatePath(`/news/${validation.data.id}`);
            revalidatePath('/admin/manage-content');
            return { success: true, message: '¡Contenido actualizado con éxito!' };
        } catch (error) {
            console.error("Error updating news item:", error);
            return { success: false, message: (error as Error).message };
        }
    } else {
        // This is a CREATE
        const validation = CreateNewsSchema.safeParse(data);
         if (!validation.success) {
            console.error("Zod create validation failed:", validation.error.issues);
            const errorMessages = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
            return { success: false, message: `Datos inválidos: ${errorMessages}` };
        }
        try {
            // Let the addNewsItem service handle default `published` and `createdAt`
            await addNewsItem(validation.data);
            revalidatePath('/');
            revalidatePath('/news');
            revalidatePath('/admin/manage-content');
            return { success: true, message: '¡Contenido guardado con éxito!' };
        } catch (error) {
            console.error("Error saving news item:", error);
            return { success: false, message: (error as Error).message };
        }
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
