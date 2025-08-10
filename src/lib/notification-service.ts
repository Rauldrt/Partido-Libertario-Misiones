
'use server';

import { getAdminDb } from './firebase-admin';
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

const defaultData: NotificationData = {
  enabled: false,
  text: '',
  link: '#',
};

async function readNotificationJson(): Promise<NotificationData> {
    const filePath = path.join(process.cwd(), 'data', 'notification.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const localData = JSON.parse(fileContent);
        return NotificationSchema.parse(localData);
    } catch (error) {
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
    // If doc doesn't exist or is invalid, seed from JSON
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
    if (!docRef) {
        throw new Error("No se puede guardar la notificación: El SDK de administrador de Firebase no está inicializado.");
    }

    const validation = NotificationSchema.safeParse(data);
    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de notificación inválidos.');
    }

    await setDoc(docRef, validation.data);
}
