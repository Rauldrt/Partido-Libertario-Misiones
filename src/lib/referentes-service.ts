
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

async function readReferentesJson(): Promise<any[]> {
    const filePath = path.join(process.cwd(), 'data', 'referentes.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
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
        throw new Error("No se pueden guardar los referentes: El SDK de administrador de Firebase no está inicializado.");
    }
    await setDoc(docRef, { list: referentes });
}
