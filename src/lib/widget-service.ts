
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';


export interface SocialWidgetData {
    embedCode: string;
}

const SocialWidgetSchema = z.object({
    embedCode: z.string().trim(),
});

async function readWidgetJson(): Promise<SocialWidgetData> {
    const filePath = path.join(process.cwd(), 'data', 'social-widget.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return SocialWidgetSchema.parse(JSON.parse(fileContent));
    } catch (error) {
        console.error("Error leyendo social-widget.json:", error);
        return { embedCode: '' };
    }
}

const getWidgetDocRef = () => {
    const db = getAdminDb();
    if (!db) return null;
    return doc(db, 'site-config', 'socialWidget');
};

export async function getSocialWidgetData(): Promise<SocialWidgetData> {
    const docRef = getWidgetDocRef();
    if (!docRef) {
        console.warn("Admin SDK no inicializado, usando social-widget.json como respaldo.");
        return readWidgetJson();
    }

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const parsed = SocialWidgetSchema.safeParse(docSnap.data());
            if(parsed.success) {
                return parsed.data;
            }
        }
        console.log("Sembrando datos del widget social desde JSON local a Firestore.");
        const localData = await readWidgetJson();
        await setDoc(docRef, localData);
        return localData;
    } catch (error) {
        console.error("Error obteniendo widget de Firestore, usando respaldo local:", error);
        return readWidgetJson();
    }
}


export async function saveSocialWidgetData(data: SocialWidgetData): Promise<void> {
    const docRef = getWidgetDocRef();
    if (!docRef) {
        throw new Error("No se puede guardar el widget: El SDK de administrador de Firebase no está inicializado.");
    }
    const validation = SocialWidgetSchema.safeParse(data);
    if (!validation.success) {
        throw new Error('Datos de widget inválidos.');
    }
    await setDoc(docRef, validation.data);
}
