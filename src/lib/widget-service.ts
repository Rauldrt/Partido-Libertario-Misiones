
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
    embedCode: z.string().trim(),
});

async function readWidgetJson(): Promise<SocialWidgetData> {
    try {
        const fileContent = await fs.readFile(widgetFilePath, 'utf-8');
        return SocialWidgetSchema.parse(JSON.parse(fileContent));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { embedCode: '' };
        }
        console.error("Error leyendo social-widget.json:", error);
        return { embedCode: '' };
    }
}

async function writeWidgetJson(data: SocialWidgetData): Promise<void> {
    try {
        await fs.writeFile(widgetFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error escribiendo en social-widget.json:", error);
        throw new Error("No se pudo escribir en el archivo del widget social local.");
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
    
    if (!docRef) {
        console.warn("Admin SDK no inicializado. Guardando widget social en archivo local.");
        await writeWidgetJson(validation.data);
        return;
    }

    await setDoc(docRef, validation.data);
}
