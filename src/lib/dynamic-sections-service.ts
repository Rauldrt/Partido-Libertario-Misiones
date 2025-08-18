
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

const getCandidatesCollectionRef = () => {
    const db = getAdminDb();
    if (!db) {
        throw new Error('La base de datos de administrador de Candidatos no está inicializada. Revisa la configuración del servidor.');
    }
    return collection(db, 'candidates');
};

const getOrganizationCollectionRef = () => {
    const db = getAdminDb();
    if (!db) {
        throw new Error('La base de datos de administrador de Organigrama no está inicializada. Revisa la configuración del servidor.');
    }
    return collection(db, 'organization');
}

async function syncCollectionFromLocal(
    collectionRef: ReturnType<typeof getCandidatesCollectionRef>,
    localFileName: string
) {
    if (!collectionRef) return;

    const localData = await readJsonData(localFileName);
    if (!localData || localData.length === 0) {
        console.log(`No local data found in ${localFileName}. Skipping sync.`);
        return;
    }
    
    console.log(`Syncing collection '${collectionRef.id}' from '${localFileName}'...`);
    const batch = writeBatch(collectionRef.firestore);

    const existingDocs = await getDocs(collectionRef);
    if(existingDocs.docs.length > 0) {
        console.log(`Deleting ${existingDocs.docs.length} existing documents before syncing.`);
        existingDocs.forEach(doc => batch.delete(doc.ref));
    }
    
    localData.forEach((item: any, index: number) => {
        const id = item.id || `${collectionRef.id.slice(0, -1)}-${index}-${Date.now()}`;
        const docRef = doc(collectionRef, id);
        batch.set(docRef, { ...item, id, order: item.order ?? index });
    });

    await batch.commit();
    console.log(`Synced ${localData.length} documents into '${collectionRef.id}'.`);
}


async function getCollectionData(
    getCollectionRef: () => ReturnType<typeof getCandidatesCollectionRef>,
    localFileName: string
): Promise<TeamMember[]> {
    const localDataPromise = readJsonData(localFileName);

    try {
        const collectionRef = getCollectionRef();
        const countSnapshot = await getCountFromServer(collectionRef);
        const docCount = countSnapshot.data().count;
        const localData = await localDataPromise;

        if (docCount === 0 && localData.length > 0) {
            console.log(`Collection ${collectionRef.id} is empty in Firestore. Seeding from ${localFileName}.`);
            await syncCollectionFromLocal(collectionRef, localFileName);
        }

        const snapshot = await getDocs(query(collectionRef, orderBy("order", "asc")));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
    } catch (error) {
        console.error(`Error fetching collection, falling back to local file. Error:`, error);
        const localData = await readJsonData(localFileName);
        return localData.map((item: any, index: number) => ({ ...item, id: item.id || `fallback-${index}`, order: item.order ?? index }));
    }
}

async function saveCollectionData(
    getCollectionRef: () => ReturnType<typeof getCandidatesCollectionRef>,
    localFileName: string,
    items: TeamMember[]
): Promise<{ message: string }> {
    
    const dataToSaveLocally = items.map(({ id, ...rest }) => rest);
    let saveLocationMessages = [];

    try {
        await fs.writeFile(path.join(process.cwd(), 'data', localFileName), JSON.stringify(dataToSaveLocally, null, 2), 'utf-8');
        saveLocationMessages.push(`el archivo local (${localFileName})`);
    } catch (e) {
        console.error(`Error guardando en archivo local ${localFileName}:`, e);
        throw new Error(`No se pudo guardar en el archivo local: ${(e as Error).message}`);
    }

    try {
        const collectionRef = getCollectionRef();
        const batch = writeBatch(collectionRef.firestore);
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
        saveLocationMessages.push('Firestore');
    } catch (e) {
         console.warn(`No se pudo guardar en Firestore, cambios guardados solo en ${localFileName}. Error:`, e);
    }


    return { message: `Datos guardados con éxito en ${saveLocationMessages.join(' y ')}.` };
}


export async function getCandidates(): Promise<TeamMember[]> {
    return getCollectionData(getCandidatesCollectionRef, 'candidates.json');
}

export async function saveCandidates(candidates: TeamMember[]): Promise<{ message: string }> {
    return saveCollectionData(getCandidatesCollectionRef, 'candidates.json', candidates);
}

export async function getOrganization(): Promise<TeamMember[]> {
    return getCollectionData(getOrganizationCollectionRef, 'organization.json');
}

export async function saveOrganization(organization: TeamMember[]): Promise<{ message: string }> {
    return saveCollectionData(getOrganizationCollectionRef, 'organization.json', organization);
}
