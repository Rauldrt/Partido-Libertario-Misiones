
'use server';

import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

export const ReferenteSchema = z.object({
  id: z.string(),
  locality: z.string(),
  name: z.string(),
  phone: z.string(),
});

export type ReferenteData = z.infer<typeof ReferenteSchema>;

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

export async function saveReferentes(referentes: ReferenteData[]): Promise<void> {
    // Strip the temporary 'id' field before writing back to the database
    const dataToSave = referentes.map(({ id, ...rest }) => rest);
    await setDoc(getReferentesDocRef(), { list: dataToSave });
}
