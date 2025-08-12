
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

const getReferentesDocRef = () => {
    const db = getAdminDb();
    if (!db) return null;
    return doc(db, 'site-config', 'referentes');
};

export async function getReferentes(): Promise<ReferenteData[]> {
    const docRef = getReferentesDocRef();
    const getFromLocal = async () => {
        const localData = await readReferentesJson();
        return localData.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
    };

    if (!docRef) {
        console.warn("Admin SDK no inicializado, usando referentes.json como respaldo.");
        return getFromLocal();
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
         return getFromLocal();
    }
}

export async function saveReferentes(referentes: Omit<ReferenteData, 'id'>[]): Promise<void> {
    const docRef = getReferentesDocRef();
    if (!docRef) {
        console.warn("Admin SDK no inicializado, guardando referentes en referentes.json.");
        await fs.writeFile(referentesFilePath, JSON.stringify(referentes, null, 2), 'utf-8');
        return;
    }
    await setDoc(docRef, { list: referentes });
}
