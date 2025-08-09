
'use server';

import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const NotificationSchema = z.object({
  enabled: z.boolean(),
  text: z.string(),
  link: z.string(),
});

export type NotificationData = z.infer<typeof NotificationSchema>;

const getNotificationDocRef = () => {
    const db = getDb();
    if (!db) throw new Error("Firestore is not initialized.");
    return doc(db, 'site-config', 'notification');
};

const defaultData: NotificationData = {
  enabled: false,
  text: '',
  link: '#',
};

async function seedNotificationData() {
    const filePath = path.join(process.cwd(), 'data', 'notification.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const localData = JSON.parse(fileContent);
        const validatedData = NotificationSchema.parse(localData);
        await setDoc(getNotificationDocRef(), validatedData);
        console.log("Successfully seeded notification data.");
        return validatedData;
    } catch (error) {
        console.error("Error seeding notification data, using default:", error);
        await setDoc(getNotificationDocRef(), defaultData);
        return defaultData;
    }
}

export async function getNotificationData(): Promise<NotificationData> {
  const docRef = getNotificationDocRef();
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const parsed = NotificationSchema.safeParse(docSnap.data());
    if (parsed.success) {
      return parsed.data;
    }
  }
  
  // If doc doesn't exist or is invalid, seed from JSON
  return await seedNotificationData();
}

export async function saveNotificationData(data: NotificationData): Promise<void> {
    const validation = NotificationSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de notificación inválidos.');
    }

    await setDoc(getNotificationDocRef(), validation.data);
}
