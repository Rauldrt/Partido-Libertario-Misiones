
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp, updateDoc, deleteDoc, type CollectionReference } from 'firebase/firestore';
import type { FormSubmission, ContactFormValues } from './form-defs';


const fromFirestore = (doc: any): FormSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
    };
};

export async function addContactSubmission(submission: ContactFormValues): Promise<void> {
    const db = await getAdminDb();
    if (!db) {
        throw new Error("No se pudo enviar el mensaje: La base de datos de administrador no está inicializada.");
    }
    const contactCollection = collection(db, 'contactSubmissions');
    await addDoc(contactCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getContactSubmissions(): Promise<FormSubmission[]> {
    try {
        const db = await getAdminDb();
        if (!db) {
            throw new Error('La base de datos de administrador no está inicializada.');
        }
        const contactCollection = collection(db, 'contactSubmissions');
        const q = query(contactCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return [];
        }
        
        return snapshot.docs.map(fromFirestore);
    } catch (error) {
        console.error("Error al obtener mensajes de contacto:", error);
        return [];
    }
}

export async function updateContactSubmission(id: string, data: Record<string, any>): Promise<{ success: boolean; message: string; }> {
    try {
        const db = await getAdminDb();
        if (!db) {
            throw new Error('La base de datos de administrador no está inicializada.');
        }
        const contactCollection = collection(db, 'contactSubmissions');
        const docRef = doc(contactCollection, id);
        await updateDoc(docRef, data);
        return { success: true, message: "Mensaje actualizado con éxito." };
    } catch (error) {
        console.error("Error updating contact submission:", error);
        return { success: false, message: "No se pudo actualizar el mensaje." };
    }
}

export async function deleteContactSubmission(id: string): Promise<{ success: boolean; message: string; }> {
    try {
        const db = await getAdminDb();
        if (!db) {
            throw new Error('La base de datos de administrador no está inicializada.');
        }
        const contactCollection = collection(db, 'contactSubmissions');
        await deleteDoc(doc(contactCollection, id));
        return { success: true, message: "Mensaje eliminado con éxito." };
    } catch (error) {
        console.error("Error deleting contact submission:", error);
        return { success: false, message: "No se pudo eliminar el mensaje." };
    }
}
