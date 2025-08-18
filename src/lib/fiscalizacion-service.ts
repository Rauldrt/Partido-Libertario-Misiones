
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc, type CollectionReference } from 'firebase/firestore';
import type { FormSubmission } from './form-defs';
import fs from 'fs/promises';
import path from 'path';

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
    const db = await getAdminDb();
    if (!db) {
        throw new Error("No se pudo enviar la inscripción: La base de datos de administrador no está inicializada.");
    }
    const fiscalizacionCollection = collection(db, 'fiscalizaciones');
    await addDoc(fiscalizacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getFiscalizacionSubmissions(): Promise<FormSubmission[]> {
    try {
        const db = await getAdminDb();
        if (!db) {
            throw new Error('La base de datos de administrador no está inicializada.');
        }
        const fiscalizacionCollection = collection(db, 'fiscalizaciones');
        const q = query(fiscalizacionCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return [];
        }
        
        return snapshot.docs.map(fromFirestore);
    } catch (error) {
        console.error("Error al obtener las fiscalizaciones:", error);
        return [];
    }
}

export async function updateFiscalizacionSubmission(id: string, data: Record<string, any>): Promise<{ success: boolean; message: string; }> {
    try {
        const db = await getAdminDb();
        if (!db) {
            throw new Error('La base de datos de administrador no está inicializada.');
        }
        const fiscalizacionCollection = collection(db, 'fiscalizaciones');
        const docRef = doc(fiscalizacionCollection, id);
        await updateDoc(docRef, data);
        return { success: true, message: "Inscripción actualizada con éxito." };
    } catch (error) {
        console.error("Error updating fiscalizacion submission:", error);
        return { success: false, message: "No se pudo actualizar la inscripción." };
    }
}

export async function deleteFiscalizacionSubmission(id: string): Promise<{ success: boolean; message: string; }> {
    try {
        const db = await getAdminDb();
        if (!db) {
            throw new Error('La base de datos de administrador no está inicializada.');
        }
        const fiscalizacionCollection = collection(db, 'fiscalizaciones');
        await deleteDoc(doc(fiscalizacionCollection, id));
        return { success: true, message: "Inscripción eliminada con éxito." };
    } catch (error) {
        console.error("Error deleting fiscalizacion submission:", error);
        return { success: false, message: "No se pudo eliminar la inscripción." };
    }
}
