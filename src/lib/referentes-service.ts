
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

export async function getReferentes(): Promise<ReferenteData[]> {
    const getFromLocal = async () => {
        const localData = await readReferentesJson();
        return localData.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
    };

    try {
        const db = await getAdminDb();
        if (!db) {
            throw new Error("Admin SDK no inicializado.");
        }
        const docRef = doc(db, 'site-config', 'referentes');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().list) {
            return docSnap.data().list.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
        }
        console.log("Sembrando datos de referentes desde JSON local a Firestore.");
        const localData = await getFromLocal();
        await setDoc(docRef, { list: localData });
        return localData.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
    } catch (error) {
         console.error("Error obteniendo referentes de Firestore, usando respaldo local:", error);
         return getFromLocal();
    }
}

export async function saveReferentes(referentes: Omit<ReferenteData, 'id'>[]): Promise<void> {
    const db = await getAdminDb();
    if (!db) {
        console.warn("Admin SDK no inicializado, guardando referentes en referentes.json.");
        await fs.writeFile(referentesFilePath, JSON.stringify(referentes, null, 2), 'utf-8');
        return;
    }
    const docRef = doc(db, 'site-config', 'referentes');
    await setDoc(docRef, { list: referentes });
}

