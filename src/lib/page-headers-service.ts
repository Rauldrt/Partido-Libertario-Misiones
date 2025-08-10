
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const pageHeadersFilePath = path.join(process.cwd(), 'data', 'page-headers.json');

// Helper to read local JSON file for seeding
async function readPageHeadersJson(): Promise<any> {
    try {
        const fileContent = await fs.readFile(pageHeadersFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return {};
        }
        console.error("Error leyendo page-headers.json:", error);
        return {}; // Return empty object on error
    }
}

const PageHeaderSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  backgroundImage: z.string().optional(),
  featuredImage: z.string().optional(),
  featuredImageTitle: z.string().optional(),
});

export type PageHeaderData = z.infer<typeof PageHeaderSchema>;
export type PageHeadersData = { [key: string]: PageHeaderData; };
const PageHeadersSchema = z.record(z.string(), PageHeaderSchema);

const getPageHeadersDocRef = () => {
    const db = getAdminDb();
    if (!db) return null;
    return doc(db, 'site-config', 'pageHeaders');
};

export async function getAllPageHeaders(): Promise<PageHeadersData> {
    const docRef = getPageHeadersDocRef();
    if (!docRef) {
        console.warn("Admin SDK no inicializado, usando page-headers.json como respaldo.");
        return readPageHeadersJson();
    }
    
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const parsed = PageHeadersSchema.safeParse(docSnap.data());
            if (parsed.success) {
                return parsed.data;
            }
        }
        // If doc doesn't exist or is invalid, seed from JSON
        console.log("Sembrando datos de encabezados desde JSON local a Firestore.");
        const localData = await readPageHeadersJson();
        await setDoc(docRef, localData);
        return localData;
    } catch (error) {
        console.error("Error obteniendo encabezados de Firestore, usando respaldo local:", error);
        return readPageHeadersJson();
    }
}

export async function getPageHeaderData(pageKey: string): Promise<PageHeaderData | undefined> {
    const allData = await getAllPageHeaders();
    return allData[pageKey];
}

export async function saveAllPageHeaders(data: PageHeadersData): Promise<void> {
    const docRef = getPageHeadersDocRef();
    const validation = PageHeadersSchema.safeParse(data);
    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de encabezados inválidos.');
    }

    if (!docRef) {
        throw new Error("No se puede guardar: El SDK de administrador de Firebase no está inicializado. Configure la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY en su entorno de producción.");
    }
    
    await setDoc(docRef, validation.data);
}
