
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

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

const getNotificationDocRef = () => {
    const db = getAdminDb();
    if (!db) return null;
    return doc(db, 'site-config', 'notification');
};

export async function getNotificationData(): Promise<NotificationData> {
  const docRef = getNotificationDocRef();
  if (!docRef) {
    console.warn("Admin SDK no inicializado, usando notification.json como respaldo.");
    return readNotificationJson();
  }
  
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const parsed = NotificationSchema.safeParse(docSnap.data());
        if (parsed.success) {
            return parsed.data;
        }
    }
    console.log("Sembrando datos de notificación desde JSON local a Firestore.");
    const localData = await readNotificationJson();
    await setDoc(docRef, localData);
    return localData;
  } catch (error) {
     console.error("Error obteniendo notificación de Firestore, usando respaldo local:", error);
     return readNotificationJson();
  }
}

export async function saveNotificationData(data: NotificationData): Promise<void> {
    const docRef = getNotificationDocRef();
    const validation = NotificationSchema.safeParse(data);
    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de notificación inválidos.');
    }

    if (!docRef) {
        throw new Error("No se puede guardar: El SDK de administrador de Firebase no está inicializado. Configure la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY en su entorno de producción.");
    }

    await setDoc(docRef, validation.data);
}
