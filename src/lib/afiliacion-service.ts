
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, deleteDoc, updateDoc, type CollectionReference } from 'firebase/firestore';
import type { FormSubmission } from './form-defs';
import fs from 'fs/promises';
import path from 'path';

// --- Firestore Collection References ---
const getAfiliacionCollection = async (): Promise<CollectionReference> => {
    const db = await getAdminDb();
    if (!db) {
        throw new Error('La base de datos de administrador no está inicializada. Revisa la configuración del servidor.');
    }
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
    const afiliacionCollection = await getAfiliacionCollection();
    await addDoc(afiliacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getAfiliacionSubmissions(): Promise<FormSubmission[]> {
    try {
        const afiliacionCollection = await getAfiliacionCollection();
        const q = query(afiliacionCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return [];
        }
        
        return snapshot.docs.map(fromFirestore);
    } catch (error) {
        console.error("Error al obtener las afiliaciones:", error);
        return [];
    }
}

export async function updateAfiliacionSubmission(id: string, data: Record<string, any>): Promise<{ success: boolean; message: string; }> {
    try {
        const afiliacionCollection = await getAfiliacionCollection();
        const docRef = doc(afiliacionCollection, id);
        await updateDoc(docRef, data);
        return { success: true, message: "Afiliación actualizada con éxito." };
    } catch (error) {
        console.error("Error updating afiliacion submission:", error);
        return { success: false, message: "No se pudo actualizar la afiliación." };
    }
}

export async function deleteAfiliacionSubmission(id: string): Promise<{ success: boolean; message: string; }> {
    try {
        const afiliacionCollection = await getAfiliacionCollection();
        await deleteDoc(doc(afiliacionCollection, id));
        return { success: true, message: "Afiliación eliminada con éxito." };
    } catch (error) {
        console.error("Error deleting afiliacion submission:", error);
        return { success: false, message: "No se pudo eliminar la afiliación." };
    }
}
