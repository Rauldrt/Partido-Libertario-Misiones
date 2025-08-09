
'use server';

import { getDb } from './firebase';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import type { AfiliacionFormValues } from '@/app/afiliacion/actions';

export interface AfiliacionSubmission extends AfiliacionFormValues {
    id: string;
    createdAt: Date;
}

const getAfiliacionCollection = () => {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  return collection(db, 'afiliaciones');
};

const fromFirestore = (doc: any): AfiliacionSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

export async function addAfiliacionSubmission(submission: AfiliacionFormValues): Promise<void> {
    const afiliacionCollection = getAfiliacionCollection();
    await addDoc(afiliacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getAfiliacionSubmissions(): Promise<AfiliacionSubmission[]> {
    const afiliacionCollection = getAfiliacionCollection();
    const q = query(afiliacionCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}
