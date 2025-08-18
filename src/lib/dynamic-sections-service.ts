
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, doc, getDocs, writeBatch, query, orderBy, getCountFromServer } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';

export interface TeamMember {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    role?: string;
    order?: number;
}

// Helper para leer archivos JSON locales como respaldo
async function readJsonData(fileName: string): Promise<any> {
    const filePath = path.join(process.cwd(), 'data', fileName);
    try {
        await fs.access(filePath);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent.trim() ? JSON.parse(fileContent) : [];
    } catch (error) {
        console.warn(`No se pudo leer el archivo local ${fileName}, se devolverá un array vacío. Error:`, error);
        return [];
    }
}


// Función unificada y robusta para obtener datos de una colección
async function getCollectionData(collectionName: 'candidates' | 'organization', localFileName: string): Promise<TeamMember[]> {
    const fallbackToLocal = async () => {
        console.warn(`Error al conectar con Firestore en la colección '${collectionName}'. Usando el archivo de respaldo local: ${localFileName}`);
        const localData = await readJsonData(localFileName);
        // Asegura que cada item tenga un ID y un orden para evitar errores en el cliente
        return localData.map((item: any, index: number) => ({
            ...item,
            id: item.id || `local-${collectionName}-${index}`,
            order: item.order ?? index,
        }));
    };

    try {
        const db = await getAdminDb();
        if (!db) {
            // Este caso ocurre si el SDK de admin falla en su inicialización.
            throw new Error("El SDK de Administrador no está inicializado.");
        }
        
        const collectionRef = collection(db, collectionName);
        
        // Verifica si la colección existe o está vacía para sembrarla si es necesario
        const countSnapshot = await getCountFromServer(collectionRef);
        if (countSnapshot.data().count === 0) {
            const localData = await readJsonData(localFileName);
            if (localData.length > 0) {
                console.log(`Colección '${collectionName}' vacía. Sembrando datos desde ${localFileName}.`);
                const batch = writeBatch(db);
                localData.forEach((item: any, index: number) => {
                    const id = item.id || `${collectionName.slice(0, -1)}-${index}-${Date.now()}`;
                    const docRef = doc(collectionRef, id);
                    batch.set(docRef, { ...item, id, order: item.order ?? index });
                });
                await batch.commit();
                console.log(`Se sincronizaron ${localData.length} documentos en '${collectionName}'.`);
            }
        }

        // Obtiene y ordena los datos de Firestore
        const snapshot = await getDocs(query(collectionRef, orderBy("order", "asc")));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));

    } catch (error) {
        // Captura cualquier error (de conexión, permisos, etc.) y usa el respaldo local
        return fallbackToLocal();
    }
}


// Función unificada para guardar datos en una colección
async function saveCollectionData(collectionName: 'candidates' | 'organization', items: TeamMember[]): Promise<{ message: string }> {
    const db = await getAdminDb();
    if (!db) {
         throw new Error(`No se pudo guardar: La base de datos de administrador no está inicializada.`);
    }

    const collectionRef = collection(db, collectionName);

    try {
        const batch = writeBatch(db);
        const snapshot = await getDocs(collectionRef);
        
        const currentIdsInDb = new Set(snapshot.docs.map(doc => doc.id));
        const newIds = new Set(items.map(item => item.id));

        // Elimina los documentos que ya no están en la lista
        currentIdsInDb.forEach(id => {
            if (!newIds.has(id)) {
                batch.delete(doc(collectionRef, id));
            }
        });

        // Actualiza o crea los nuevos documentos con el orden correcto
        items.forEach((item, index) => {
            const docRef = doc(collectionRef, item.id);
            batch.set(docRef, { ...item, order: index });
        });
        
        await batch.commit();
        return { message: `Datos guardados con éxito en Firestore.` };
    } catch (e) {
         console.error(`Error al guardar la colección '${collectionName}' en Firestore:`, e);
         throw new Error(`Error al guardar en Firestore: ${(e as Error).message}`);
    }
}

// --- Funciones Públicas Exportadas ---

export async function getCandidates(): Promise<TeamMember[]> {
    return getCollectionData('candidates', 'candidates.json');
}

export async function saveCandidates(candidates: TeamMember[]): Promise<{ message: string }> {
    return saveCollectionData('candidates', candidates);
}

export async function getOrganization(): Promise<TeamMember[]> {
    return getCollectionData('organization', 'organization.json');
}

export async function saveOrganization(organization: TeamMember[]): Promise<{ message: string }> {
    return saveCollectionData('organization', organization);
}
