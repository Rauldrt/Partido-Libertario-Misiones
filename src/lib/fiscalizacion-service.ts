
'use server';

import { getDb } from './firebase';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import type { FiscalizacionFormValues } from '@/app/fiscalizacion/actions';

export interface FiscalizacionSubmission extends FiscalizacionFormValues {
    id: string;
    createdAt: Date;
}

const getFiscalizacionCollection = () => {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  return collection(db, 'fiscalizaciones');
};

const fromFirestore = (doc: any): FiscalizacionSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

export async function addFiscalizacionSubmission(submission: FiscalizacionFormValues): Promise<void> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    await addDoc(fiscalizacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getFiscalizacionSubmissions(): Promise<FiscalizacionSubmission[]> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    const q = query(fiscalizacionCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}
