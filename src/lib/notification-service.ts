
import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

export const NotificationSchema = z.object({
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

export async function getNotificationData(): Promise<NotificationData> {
  const docSnap = await getDoc(getNotificationDocRef());
  if (docSnap.exists()) {
    const parsed = NotificationSchema.safeParse(docSnap.data());
    if (parsed.success) {
      return parsed.data;
    }
  }
  return defaultData;
}

export async function saveNotificationData(data: NotificationData): Promise<void> {
    const validation = NotificationSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de notificación inválidos.');
    }

    await setDoc(getNotificationDocRef(), validation.data);
}
