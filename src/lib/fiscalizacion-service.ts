
'use server';

import { getDb } from './firebase';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import * as z from "zod";

export const fiscalizacionFormSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo es requerido." }),
  dni: z.string().regex(/^\d{7,8}$/, { message: "El DNI debe tener 7 u 8 dígitos." }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  phone: z.string().min(7, { message: "El teléfono es requerido." }),
  city: z.string().min(3, { message: "La localidad es requerida." }),
  previousExperience: z.boolean().default(false),
  availability: z.enum(["completa", "parcial", "indistinta"], {
    required_error: "Debe seleccionar una disponibilidad.",
  }),
  notes: z.string().max(300, { message: "Las notas no pueden exceder los 300 caracteres." }).optional(),
});

export type FiscalizacionFormValues = z.infer<typeof fiscalizacionFormSchema>;

export interface FiscalizacionSubmission extends FiscalizacionFormValues {
    id: string;
    createdAt: Date;
}

const getFiscalizacionCollection = () => {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  return collection(db, 'fiscalizaciones');
};

const fromFirestore = (doc: any): FiscalizacionSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

export async function addFiscalizacionSubmission(submission: FiscalizacionFormValues): Promise<void> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    await addDoc(fiscalizacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getFiscalizacionSubmissions(): Promise<FiscalizacionSubmission[]> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    const q = query(fiscalizacionCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}
