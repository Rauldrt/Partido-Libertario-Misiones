
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';

export interface ReferenteData {
  id: string;
  locality: string;
  name: string;
  phone: string;
}

const referentesFilePath = path.join(process.cwd(), 'data', 'referentes.json');

async function readReferentesJson(): Promise<any[]> {
    try {
        const fileContent = await fs.readFile(referentesFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Error leyendo referentes.json:", error);
        return [];
    }
}

async function writeReferentesJson(data: any[]): Promise<void> {
    try {
        await fs.writeFile(referentesFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error escribiendo en referentes.json:", error);
        throw new Error("No se pudo escribir en el archivo de referentes local.");
    }
}

const getReferentesDocRef = () => {
    const db = getAdminDb();
    if (!db) return null;
    return doc(db, 'site-config', 'referentes');
};

export async function getReferentes(): Promise<ReferenteData[]> {
    const docRef = getReferentesDocRef();
    if (!docRef) {
        console.warn("Admin SDK no inicializado, usando referentes.json como respaldo.");
        const localData = await readReferentesJson();
        return localData.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
    }
    
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().list) {
            return docSnap.data().list.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
        }
        console.log("Sembrando datos de referentes desde JSON local a Firestore.");
        const localData = await readReferentesJson();
        await setDoc(docRef, { list: localData });
        return localData.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
    } catch (error) {
         console.error("Error obteniendo referentes de Firestore, usando respaldo local:", error);
         const localData = await readReferentesJson();
         return localData.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
    }
}

export async function saveReferentes(referentes: Omit<ReferenteData, 'id'>[]): Promise<void> {
    const docRef = getReferentesDocRef();
    if (!docRef) {
        console.warn("Admin SDK no inicializado. Guardando referentes en archivo local.");
        await writeReferentesJson(referentes);
        return;
    }
    await setDoc(docRef, { list: referentes });
}
