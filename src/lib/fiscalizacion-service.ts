
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import type { FiscalizacionSubmission, FiscalizacionFormValues } from './form-service';
import fs from 'fs/promises';
import path from 'path';

const fiscalizacionesFilePath = path.join(process.cwd(), 'data', 'fiscalizacion-submissions.json');

// --- Firestore Collection References ---
const getFiscalizacionCollection = () => {
  const db = getAdminDb();
  return db ? collection(db, 'fiscalizaciones') : null;
};

// --- Local JSON file helpers ---
async function readFiscalizacionesJson(): Promise<FiscalizacionSubmission[]> {
    try {
        const fileContent = await fs.readFile(fiscalizacionesFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // File doesn't exist, return empty array
        }
        console.error("Error al leer fiscalizacion-submissions.json:", error);
        return [];
    }
}

async function writeFiscalizacionesJson(data: FiscalizacionSubmission[]): Promise<void> {
    try {
        await fs.writeFile(fiscalizacionesFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error al escribir en fiscalizacion-submissions.json:", error);
        throw new Error("No se pudo guardar la presentación de fiscalización localmente.");
    }
}


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

    if (fiscalizacionCollection) {
        await addDoc(fiscalizacionCollection, {
            ...submission,
            createdAt: serverTimestamp(),
        });
    } else {
        console.warn("Firebase Admin SDK no inicializado. Guardando fiscalización en archivo local.");
        const submissions = await readFiscalizacionesJson();
        const newSubmission: FiscalizacionSubmission = {
            id: `local-${Date.now()}`,
            createdAt: new Date(),
            ...submission,
        };
        submissions.unshift(newSubmission); // Add to the beginning of the list
        await writeFiscalizacionesJson(submissions);
    }
}

export async function getFiscalizacionSubmissions(): Promise<FiscalizacionSubmission[]> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    
    const getFromLocal = async (): Promise<FiscalizacionSubmission[]> => {
        const localData = await readFiscalizacionesJson();
        // The local file already contains full submission objects, just parse dates
        return localData.map(item => ({...item, createdAt: new Date(item.createdAt)}));
    };

    if (!fiscalizacionCollection) {
        return getFromLocal();
    }
    
    try {
        const q = query(fiscalizacionCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            // Attempt to seed from local file if it exists
             const localSubmissions = await getFromLocal();
             if (localSubmissions.length > 0) {
                 console.log(`Sembrando ${localSubmissions.length} fiscalizaciones desde el archivo local a Firestore.`);
                 const batch = writeBatch(fiscalizacionCollection.firestore);
                 localSubmissions.forEach(sub => {
                     // We create a new doc ref to get a new Firestore-generated ID
                     const docRef = doc(fiscalizacionCollection);
                     const { id, ...dataToSave } = sub; // Exclude local ID
                     batch.set(docRef, dataToSave);
                 });
                 await batch.commit();
             }
             return localSubmissions;
        }
        
        return snapshot.docs.map(fromFirestore);

    } catch (error) {
        console.error("Error obteniendo fiscalizaciones de Firestore, usando respaldo local:", error);
        return getFromLocal();
    }
}
