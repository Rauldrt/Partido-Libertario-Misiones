
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import type { AfiliacionSubmission } from './form-service';

// --- Firestore Collection References ---
const getAfiliacionCollection = () => {
    const db = getAdminDb();
    if (!db) {
        throw new Error("No se puede acceder a la base de datos: El SDK de administrador de Firebase no está inicializado.");
    }
    return collection(db, 'afiliaciones');
};


// --- Helper Functions ---
const fromFirestore = (doc: any): AfiliacionSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

// --- Public Service Functions ---
export async function addAfiliacionSubmission(submission: Record<string, any>): Promise<void> {
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
