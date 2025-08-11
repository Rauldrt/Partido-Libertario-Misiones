
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import * as z from "zod";
import fs from 'fs/promises';
import path from 'path';
import type { FormSubmission } from './form-defs';

export const contactFormSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo es requerido." }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

const getContactCollection = () => {
  const db = getAdminDb();
  if (!db) return null;
  return collection(db, 'contactSubmissions');
};

const fromFirestore = (doc: any): FormSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
    };
};

export async function addContactSubmission(submission: ContactFormValues): Promise<void> {
    const contactCollection = getContactCollection();
    if (!contactCollection) {
        throw new Error('La base de datos no está disponible.');
    }
    await addDoc(contactCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getContactSubmissions(): Promise<FormSubmission[]> {
    const contactCollection = getContactCollection();
    
    if (!contactCollection) {
        console.warn('Firebase Admin SDK not initialized. Reading contact submissions from local JSON file.');
        return [];
    }
    
    const q = query(contactCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}

export async function updateContactSubmission(id: string, data: Record<string, any>): Promise<{ success: boolean; message: string; }> {
    const contactCollection = getContactCollection();
    if (!contactCollection) {
        return { success: false, message: "La base de datos no está disponible." };
    }
    try {
        const docRef = doc(contactCollection, id);
        await updateDoc(docRef, data);
        return { success: true, message: "Mensaje actualizado con éxito." };
    } catch (error) {
        console.error("Error updating contact submission:", error);
        return { success: false, message: "No se pudo actualizar el mensaje." };
    }
}

export async function deleteContactSubmission(id: string): Promise<{ success: boolean; message: string; }> {
    const contactCollection = getContactCollection();
    if (!contactCollection) {
        return { success: false, message: "La base de datos no está disponible." };
    }
    try {
        await deleteDoc(doc(contactCollection, id));
        return { success: true, message: "Mensaje eliminado con éxito." };
    } catch (error) {
        console.error("Error deleting contact submission:", error);
        return { success: false, message: "No se pudo eliminar el mensaje." };
    }
}
