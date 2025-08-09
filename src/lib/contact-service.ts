
import { getDb } from './firebase';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import * as z from "zod";

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
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
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
    await addDoc(contactCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
    const contactCollection = getContactCollection();
    const q = query(contactCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}
