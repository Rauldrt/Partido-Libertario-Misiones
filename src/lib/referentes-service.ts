
'use server';

import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface ReferenteData {
  id: string;
  locality: string;
  name: string;
  phone: string; // WhatsApp number, e.g., 5493764123456
}

const getReferentesDocRef = () => {
    const db = getDb();
    if (!db) throw new Error("Firestore is not initialized.");
    // Store all referentes in a single document, in an array field.
    return doc(db, 'site-config', 'referentes');
};

export async function getReferentes(): Promise<ReferenteData[]> {
    const docSnap = await getDoc(getReferentesDocRef());
    if (docSnap.exists() && docSnap.data().list) {
        // Add unique IDs for React keys and dnd-kit from Firestore data
        return docSnap.data().list.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
    }
    return [];
}

export async function saveReferentes(referentes: ReferenteData[]): Promise<void> {
    // Strip the temporary 'id' field before writing back to the database
    const dataToSave = referentes.map(({ id, ...rest }) => rest);
    await setDoc(getReferentesDocRef(), { list: dataToSave });
}
