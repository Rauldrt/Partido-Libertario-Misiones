
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
});

export async function saveNewsItemAction(data: Partial<NewsCardData>) {
    const validation = NewsItemSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, message: 'Invalid data provided.', errors: validation.error.issues };
    }

    try {
        if (validation.data.id) {
            // This is an update
            const { id, ...updateData } = validation.data;
            await updateNewsItem(id, updateData);
            
            revalidatePath('/');
            revalidatePath('/news');
            revalidatePath(`/news/${id}`);
            revalidatePath('/admin/manage-content');
            
            return { success: true, message: '¡Contenido actualizado con éxito!' };
        } else {
            // This is a new item
            const { id, linkUrl, ...newsData } = validation.data;
            await addNewsItem(newsData);
            
            revalidatePath('/');
            revalidatePath('/news');
            revalidatePath('/admin/manage-content');
            
            return { success: true, message: '¡Contenido guardado con éxito!' };
        }
    } catch (error) {
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
