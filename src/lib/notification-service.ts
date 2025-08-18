
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const notificationFilePath = path.join(process.cwd(), 'data', 'notification.json');

const NotificationSchema = z.object({
  enabled: z.boolean(),
  text: z.string(),
  link: z.string(),
});

export type NotificationData = z.infer<typeof NotificationSchema>;

const defaultData: NotificationData = {
  enabled: false,
  text: '',
  link: '#',
};

async function readNotificationJson(): Promise<NotificationData> {
    try {
        const fileContent = await fs.readFile(notificationFilePath, 'utf-8');
        const localData = JSON.parse(fileContent);
        return NotificationSchema.parse(localData);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return defaultData;
        }
        console.error("Error leyendo notification.json, usando valores por defecto:", error);
        return defaultData;
    }
}

export async function getNotificationData(): Promise<NotificationData> {
  return readNotificationJson();
}

export async function saveNotificationData(data: NotificationData): Promise<void> {
    const validation = NotificationSchema.safeParse(data);
    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de notificación inválidos.');
    }
    await fs.writeFile(notificationFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
}
