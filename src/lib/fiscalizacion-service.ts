
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { FormSubmission } from './form-defs';
import fs from 'fs/promises';
import path from 'path';


// --- Firestore Collection References ---
const getFiscalizacionCollection = () => {
  const db = getAdminDb();
  if (!db) return null;
  return collection(db, 'fiscalizaciones');
};


// --- Helper Functions ---
const fromFirestore = (doc: any): FormSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

// --- Public Service Functions ---
export async function addFiscalizacionSubmission(submission: Record<string, any>): Promise<void> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    if (!fiscalizacionCollection) {
        throw new Error('La base de datos no está disponible.');
    }
    await addDoc(fiscalizacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getFiscalizacionSubmissions(): Promise<FormSubmission[]> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    
    if (!fiscalizacionCollection) {
         console.warn('Firebase Admin SDK not initialized. Reading fiscalizacion submissions from local JSON file.');
         return [];
    }

    const q = query(fiscalizacionCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}

export async function updateFiscalizacionSubmission(id: string, data: Record<string, any>): Promise<{ success: boolean; message: string; }> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    if (!fiscalizacionCollection) {
        return { success: false, message: "La base de datos no está disponible." };
    }
    try {
        const docRef = doc(fiscalizacionCollection, id);
        await updateDoc(docRef, data);
        return { success: true, message: "Inscripción actualizada con éxito." };
    } catch (error) {
        console.error("Error updating fiscalizacion submission:", error);
        return { success: false, message: "No se pudo actualizar la inscripción." };
    }
}

export async function deleteFiscalizacionSubmission(id: string): Promise<{ success: boolean; message: string; }> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    if (!fiscalizacionCollection) {
        return { success: false, message: "La base de datos no está disponible." };
    }
    try {
        await deleteDoc(doc(fiscalizacionCollection, id));
        return { success: true, message: "Inscripción eliminada con éxito." };
    } catch (error) {
        console.error("Error deleting fiscalizacion submission:", error);
        return { success: false, message: "No se pudo eliminar la inscripción." };
    }
}
