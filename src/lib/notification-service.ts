
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

export const NotificationSchema = z.object({
  enabled: z.boolean(),
  text: z.string(),
  link: z.string(),
});

export type NotificationData = z.infer<typeof NotificationSchema>;

const filePath = path.join(process.cwd(), 'data', 'notification.json');

const defaultData: NotificationData = {
  enabled: false,
  text: '',
  link: '#',
};

export async function getNotificationData(): Promise<NotificationData> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const parsed = NotificationSchema.safeParse(jsonData);

    if (parsed.success) {
      return parsed.data;
    }
    
    console.warn("Notification data is invalid, returning default data.", parsed.error.issues);
    return defaultData;

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    console.error(`Failed to read data from ${filePath}:`, error);
    return defaultData; // Return default on other errors to prevent crashes
  }
}

export async function saveNotificationData(data: NotificationData): Promise<void> {
    const validation = NotificationSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de notificación inválidos.');
    }

    try {
        await fs.writeFile(filePath, JSON.stringify(validation.data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Failed to write data to ${filePath}:`, error);
        throw new Error(`Could not save notification data to ${filePath}.`);
    }
}
