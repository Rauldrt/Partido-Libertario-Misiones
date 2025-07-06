
'use server';

import { z } from 'zod';
import { addNewsItem } from '@/lib/news-service';
import type { NewsCardData } from '@/lib/news-service';
import { revalidatePath } from 'next/cache';

const NewsItemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
    summary: z.string().min(1, 'Summary is required'),
    content: z.string().optional().default(''),
    imageUrl: z.string().url('Must be a valid URL'),
    imageHint: z.string().default(''),
    type: z.enum(['news', 'event']),
    youtubeVideoId: z.string().optional().default(''),
    linkUrl: z.string().optional(), // These are generated server-side
    id: z.string().optional(),
});

export async function saveNewsItemAction(data: Partial<NewsCardData>) {
    const validation = NewsItemSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, message: 'Invalid data provided.', errors: validation.error.issues };
    }

    try {
        const { id, linkUrl, ...newsData } = validation.data;
        await addNewsItem(newsData);
        
        revalidatePath('/');
        revalidatePath('/news');
        
        return { success: true, message: '¡Noticia guardada con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
