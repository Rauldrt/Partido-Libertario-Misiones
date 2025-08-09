
'use server';

import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';

// This type is now defined in the actions file to avoid exporting from a 'use server' file.
export interface ReferenteData {
  id: string;
  locality: string;
  name: string;
  phone: string;
}

const getReferentesDocRef = () => {
    const db = getDb();
    if (!db) throw new Error("Firestore is not initialized.");
    return doc(db, 'site-config', 'referentes');
};

async function seedReferentesData() {
    const filePath = path.join(process.cwd(), 'data', 'referentes.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const localData = JSON.parse(fileContent);
        await setDoc(getReferentesDocRef(), { list: localData });
        console.log("Successfully seeded referentes data.");
        return localData;
    } catch (error) {
        console.error("Error seeding referentes data, returning empty array:", error);
        return [];
    }
}

export async function getReferentes(): Promise<ReferenteData[]> {
    const docSnap = await getDoc(getReferentesDocRef());
    if (docSnap.exists() && docSnap.data().list) {
        return docSnap.data().list.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
    }
    const seededData = await seedReferentesData();
    return seededData.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
}

export async function saveReferentes(referentes: Omit<ReferenteData, 'id'>[]): Promise<void> {
    await setDoc(getReferentesDocRef(), { list: referentes });
}
