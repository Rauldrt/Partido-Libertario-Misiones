
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import type { FiscalizacionSubmission, FiscalizacionFormValues } from './form-service';

// --- Firestore Collection References ---
const getFiscalizacionCollection = () => {
  const db = getAdminDb();
  if (!db) {
      throw new Error("No se puede acceder a la base de datos: El SDK de administrador de Firebase no está inicializado.");
  }
  return collection(db, 'fiscalizaciones');
};


// --- Helper Functions ---
const fromFirestore = (doc: any): FiscalizacionSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

// --- Public Service Functions ---
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
