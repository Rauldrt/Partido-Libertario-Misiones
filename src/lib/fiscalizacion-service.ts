
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import type { FiscalizacionSubmission, FiscalizacionFormValues } from './form-defs';
import fs from 'fs/promises';
import path from 'path';


// --- Firestore Collection References ---
const getFiscalizacionCollection = () => {
  const db = getAdminDb();
  if (!db) return null;
  return collection(db, 'fiscalizaciones');
};


// --- Helper Functions ---
const fromFirestore = (doc: any): FiscalizacionSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

// --- Public Service Functions ---
export async function addFiscalizacionSubmission(submission: FiscalizacionFormValues): Promise<void> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    if (!fiscalizacionCollection) {
        console.warn('Firebase Admin SDK not initialized. Saving fiscalizacion submission to local JSON file.');
        const filePath = path.join(process.cwd(), 'data', 'form-submissions-fiscalizacion.json');
        try {
            let submissions: any[] = [];
            try {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                submissions = JSON.parse(fileContent);
            } catch (error) {
                // File might not exist yet, which is fine
            }
            submissions.push({ ...submission, createdAt: new Date().toISOString() });
            await fs.writeFile(filePath, JSON.stringify(submissions, null, 2), 'utf-8');
            return;
        } catch (error) {
            console.error('Failed to write to local fiscalizacion submission file:', error);
            throw new Error('La base de datos no está disponible y no se pudo guardar localmente.');
        }
    }
    await addDoc(fiscalizacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getFiscalizacionSubmissions(): Promise<FiscalizacionSubmission[]> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    
    if (!fiscalizacionCollection) {
         console.warn('Firebase Admin SDK not initialized. Reading fiscalizacion submissions from local JSON file.');
         const filePath = path.join(process.cwd(), 'data', 'form-submissions-fiscalizacion.json');
         try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(fileContent);
            // Simulate the same data shape as Firestore
            return data.map((item: any, index: number) => ({
                id: `local-${index}`,
                ...item,
                createdAt: new Date(item.createdAt)
            })).sort((a: any, b: any) => b.createdAt - a.createdAt);
         } catch (error) {
            return []; // File might not exist
         }
    }

    const q = query(fiscalizacionCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}
