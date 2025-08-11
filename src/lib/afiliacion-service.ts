
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { FormSubmission } from './form-defs';
import fs from 'fs/promises';
import path from 'path';

// --- Firestore Collection References ---
const getAfiliacionCollection = () => {
    const db = getAdminDb();
    if (!db) return null;
    return collection(db, 'afiliaciones');
};


// --- Helper Functions ---
const fromFirestore = (doc: any): FormSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(), // Convert Firestore Timestamp to Date safely
    };
};

// --- Public Service Functions ---
export async function addAfiliacionSubmission(submission: Record<string, any>): Promise<void> {
    const afiliacionCollection = getAfiliacionCollection();
    if (!afiliacionCollection) {
        throw new Error('La base de datos no está disponible.');
    }
    await addDoc(afiliacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getAfiliacionSubmissions(): Promise<FormSubmission[]> {
    const afiliacionCollection = getAfiliacionCollection();
    if (!afiliacionCollection) {
         console.warn('Firebase Admin SDK not initialized. Reading afiliacion submissions from local JSON file.');
         return []; // No local file support for this page
    }
    const q = query(afiliacionCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}

export async function updateAfiliacionSubmission(id: string, data: Record<string, any>): Promise<{ success: boolean; message: string; }> {
    const afiliacionCollection = getAfiliacionCollection();
    if (!afiliacionCollection) {
        return { success: false, message: "La base de datos no está disponible." };
    }
    try {
        const docRef = doc(afiliacionCollection, id);
        await updateDoc(docRef, data);
        return { success: true, message: "Afiliación actualizada con éxito." };
    } catch (error) {
        console.error("Error updating afiliacion submission:", error);
        return { success: false, message: "No se pudo actualizar la afiliación." };
    }
}

export async function deleteAfiliacionSubmission(id: string): Promise<{ success: boolean; message: string; }> {
    const afiliacionCollection = getAfiliacionCollection();
    if (!afiliacionCollection) {
        return { success: false, message: "La base de datos no está disponible." };
    }
    try {
        await deleteDoc(doc(afiliacionCollection, id));
        return { success: true, message: "Afiliación eliminada con éxito." };
    } catch (error) {
        console.error("Error deleting afiliacion submission:", error);
        return { success: false, message: "No se pudo eliminar la afiliación." };
    }
}
