
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import * as z from "zod";
import fs from 'fs/promises';
import path from 'path';

export const contactFormSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo es requerido." }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export interface ContactSubmission extends ContactFormValues {
    id: string;
    createdAt: Date;
}

const getContactCollection = () => {
  const db = getAdminDb();
  if (!db) return null;
  return collection(db, 'contactSubmissions');
};

const fromFirestore = (doc: any): ContactSubmission => {
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
        console.warn('Firebase Admin SDK not initialized. Saving contact submission to local JSON file.');
        const filePath = path.join(process.cwd(), 'data', 'form-submissions-contact.json');
        try {
            let submissions: any[] = [];
            try {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                submissions = JSON.parse(fileContent);
            } catch (error) {
                // File might not exist yet
            }
            submissions.push({ ...submission, createdAt: new Date().toISOString() });
            await fs.writeFile(filePath, JSON.stringify(submissions, null, 2), 'utf-8');
            return;
        } catch (error) {
            console.error('Failed to write to local contact submission file:', error);
            throw new Error('La base de datos no está disponible y no se pudo guardar localmente.');
        }
    }
    await addDoc(contactCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
    const contactCollection = getContactCollection();
    
    if (!contactCollection) {
        console.warn('Firebase Admin SDK not initialized. Reading contact submissions from local JSON file.');
        const filePath = path.join(process.cwd(), 'data', 'form-submissions-contact.json');
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(fileContent);
            return data.map((item: any, index: number) => ({
                id: `local-${index}`,
                ...item,
                createdAt: new Date(item.createdAt)
            })).sort((a:any, b:any) => b.createdAt - a.createdAt);
        } catch (error) {
            return []; // File might not exist
        }
    }
    
    const q = query(contactCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}
