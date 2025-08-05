
'use server';

import { z } from 'zod';
import { addNewsItem, updateNewsItem, getNewsItemById } from '@/lib/news-service';
import type { NewsCardData } from '@/lib/news-service';
import { revalidatePath } from 'next/cache';

const NewsItemSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
    summary: z.string().min(1, 'Summary is required'),
    content: z.string().optional().default(''),
    imageUrl: z.string().url('Must be a valid URL'),
    imageHint: z.string().default(''),
    type: z.enum(['news', 'event']),
    youtubeVideoId: z.string().optional().default(''),
    embedCode: z.string().optional().default(''),
    linkUrl: z.string().optional(),
    published: z.boolean().optional(),
    createdAt: z.any().optional(), 
});

export async function saveNewsItemAction(data: Partial<NewsCardData>) {
    
    // Ensure 'published' has a default value if it's a new item.
    if (!data.id && data.published === undefined) {
        data.published = true;
    }
    
    const validation = NewsItemSchema.safeParse(data);

    if (!validation.success) {
        console.error("Zod validation failed:", validation.error.issues);
        return { success: false, message: 'Invalid data provided.', errors: validation.error.issues };
    }

    try {
        const { id, createdAt, ...saveData } = validation.data;

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
            const { linkUrl, ...newsData } = saveData;
            await addNewsItem(newsData);
            
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
