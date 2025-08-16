
'use server';

import { z } from 'zod';
import { addNewsItem, updateNewsItem, getNewsItemById } from '@/lib/news-service';
import type { NewsCardData } from '@/lib/news-service';
import { revalidatePath } from 'next/cache';

const NewsLinkSchema = z.object({
    title: z.string().min(1, 'El título del enlace es requerido.'),
    url: z.string().url('Debe ser una URL válida.'),
});

// Base schema for the core fields that are always expected from the form.
const BaseNewsSchema = z.object({
    title: z.string().min(1, 'El título es requerido.'),
    date: z.string().min(1, 'La fecha es requerida.'),
    summary: z.string().min(1, 'El resumen es requerido.'),
    imageUrl: z.string().url('Debe ser una URL válida.'),
    type: z.enum(['news', 'event']),
    content: z.string().optional(),
    imageHint: z.string().optional(),
    youtubeVideoId: z.string().optional(),
    embedCode: z.string().optional(),
    published: z.boolean().optional(),
    links: z.array(NewsLinkSchema).optional(),
});

// Schema for creating a new item. `id` should not be present.
const CreateNewsSchema = BaseNewsSchema;

// Schema for updating an item. `id` is required.
const UpdateNewsSchema = BaseNewsSchema.extend({
    id: z.string().min(1, "El ID es requerido para actualizar."),
});

export async function saveNewsItemAction(data: Partial<NewsCardData>) {
    
    if (data.id) {
        // This is an UPDATE
        const validation = UpdateNewsSchema.safeParse(data);
        if (!validation.success) {
            const errorMessages = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
            return { success: false, message: `Datos inválidos: ${errorMessages}` };
        }
        try {
            const { id, ...updateData } = validation.data;
            await updateNewsItem(id, updateData);
            revalidatePath('/');
            revalidatePath('/news');
            revalidatePath(`/news/${id}`);
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
            const errorMessages = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
            return { success: false, message: `Datos inválidos: ${errorMessages}` };
        }
        try {
            // The service function will handle setting createdAt and default published status
            await addNewsItem(validation.data as any);
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

    
