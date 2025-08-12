
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';


export interface SocialWidgetData {
    embedCode: string;
}

const widgetFilePath = path.join(process.cwd(), 'data', 'social-widget.json');

const SocialWidgetSchema = z.object({
    embedCode: z.string().trim().optional().default(''),
});

async function readWidgetJson(): Promise<SocialWidgetData> {
    try {
        const fileContent = await fs.readFile(widgetFilePath, 'utf-8');
        const parsed = SocialWidgetSchema.safeParse(JSON.parse(fileContent));
        if (parsed.success) return parsed.data;
        return { embedCode: '' };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { embedCode: '' };
        }
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
    const validation = SocialWidgetSchema.safeParse(data);
    if (!validation.success) {
        throw new Error('Datos de widget inválidos.');
    }
    const dataToSave = validation.data;

    if (!docRef) {
        console.warn("Admin SDK no inicializado, guardando widget social en social-widget.json.");
        await fs.writeFile(widgetFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
        return;
    }

    await setDoc(docRef, dataToSave);
}
