
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

async function readJsonData(fileName: string): Promise<any> {
    const filePath = path.join(process.cwd(), 'data', fileName);
    try {
        await fs.access(filePath);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent.trim() ? JSON.parse(fileContent) : [];
    } catch (error) {
        console.warn(`Could not read ${fileName}, returning empty array. Error:`, error);
        return [];
    }
}


async function getCollectionData(collectionName: 'candidates' | 'organization', localFileName: string): Promise<TeamMember[]> {
    const db = await getAdminDb();

    // If Firestore is not available, fall back to local JSON
    if (!db) {
        console.warn(`Firestore Admin SDK not initialized. Falling back to local file: ${localFileName}`);
        const localData = await readJsonData(localFileName);
        return localData.map((item: any, index: number) => ({ ...item, id: item.id || `fallback-${index}`, order: item.order ?? index }));
    }
    
    const collectionRef = collection(db, collectionName);
    
    try {
        const countSnapshot = await getCountFromServer(collectionRef);
        
        if (countSnapshot.data().count === 0) {
            const localData = await readJsonData(localFileName);
            if (localData.length > 0) {
                console.log(`Collection ${collectionName} is empty in Firestore. Seeding from ${localFileName}.`);
                const batch = writeBatch(db);
                localData.forEach((item: any, index: number) => {
                    const id = item.id || `${collectionName.slice(0, -1)}-${index}-${Date.now()}`;
                    const docRef = doc(collectionRef, id);
                    batch.set(docRef, { ...item, id, order: item.order ?? index });
                });
                await batch.commit();
                console.log(`Synced ${localData.length} documents into '${collectionName}'.`);
            }
        }

        const snapshot = await getDocs(query(collectionRef, orderBy("order", "asc")));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));

    } catch (error) {
        console.error(`Error fetching collection ${collectionName}, falling back to local file. Error:`, error);
        const localData = await readJsonData(localFileName);
        return localData.map((item: any, index: number) => ({ ...item, id: item.id || `fallback-${index}`, order: item.order ?? index }));
    }
}


async function saveCollectionData(collectionName: 'candidates' | 'organization', items: TeamMember[]): Promise<{ message: string }> {
    const db = await getAdminDb();
    if (!db) {
         throw new Error(`Error al guardar en Firestore: La base de datos de administrador no está inicializada.`);
    }

    const collectionRef = collection(db, collectionName);

    try {
        const batch = writeBatch(db);
        const snapshot = await getDocs(collectionRef);
        
        const currentIdsInDb = new Set(snapshot.docs.map(doc => doc.id));
        const newIds = new Set(items.map(item => item.id));

        currentIdsInDb.forEach(id => {
            if (!newIds.has(id)) {
                batch.delete(doc(collectionRef, id));
            }
        });

        items.forEach((item, index) => {
            const docRef = doc(collectionRef, item.id);
            batch.set(docRef, { ...item, order: index });
        });
        
        await batch.commit();
        return { message: `Datos guardados con éxito en Firestore.` };
    } catch (e) {
         console.error(`No se pudo guardar en Firestore en la colección ${collectionName}:`, e);
         throw new Error(`Error al guardar en Firestore: ${(e as Error).message}`);
    }
}


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
