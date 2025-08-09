
'use server';

import { getDb } from './firebase';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import * as z from "zod";

export const afiliacionFormSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo es requerido." }),
  dni: z.string().regex(/^\d{7,8}$/, { message: "El DNI debe tener 7 u 8 dígitos." }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  phone: z.string().min(7, { message: "El teléfono es requerido." }),
  city: z.string().min(3, { message: "La localidad es requerida." }),
  address: z.string().min(5, { message: "La dirección es requerida." }),
});

export type AfiliacionFormValues = z.infer<typeof afiliacionFormSchema>;

export interface AfiliacionSubmission extends AfiliacionFormValues {
    id: string;
    createdAt: Date;
}

const getAfiliacionCollection = () => {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  return collection(db, 'afiliaciones');
};

const fromFirestore = (doc: any): AfiliacionSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

export async function addAfiliacionSubmission(submission: AfiliacionFormValues): Promise<void> {
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
