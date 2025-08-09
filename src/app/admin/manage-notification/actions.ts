
'use server';

import { revalidatePath } from 'next/cache';
import { saveNotificationData, type NotificationData } from '@/lib/notification-service';
import { z } from 'zod';

const NotificationSchema = z.object({
  enabled: z.boolean(),
  text: z.string(),
  link: z.string(),
});


export async function saveNotificationDataAction(data: NotificationData) {
    const validation = NotificationSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        return { success: false, message: 'Datos inválidos. Por favor, revise todos los campos.' };
    }

    try {
        await saveNotificationData(validation.data);
        revalidatePath('/');
        
        return { success: true, message: '¡Notificación guardada con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
