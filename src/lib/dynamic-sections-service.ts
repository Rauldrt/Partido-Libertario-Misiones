
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, doc, getDocs, writeBatch, query, orderBy, deleteDoc } from 'firebase/firestore';
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
    if (!db) return null;
    return collection(db, 'candidates');
};

const getOrganizationCollectionRef = () => {
    const db = getAdminDb();
    if (!db) return null;
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

    // Clear existing collection
    const existingDocs = await getDocs(collectionRef);
    existingDocs.forEach(doc => batch.delete(doc.ref));
    
    // Add all documents from local file
    localData.forEach((item: any, index: number) => {
        const id = item.id || `${collectionRef.id.slice(0, -1)}-${index}-${Date.now()}`;
        const docRef = doc(collectionRef, id);
        batch.set(docRef, { ...item, id, order: item.order ?? index });
    });

    await batch.commit();
    console.log(`Synced ${localData.length} documents into '${collectionRef.id}'.`);
}


async function getCollectionData(
    collectionRef: ReturnType<typeof getCandidatesCollectionRef>,
    localFileName: string
): Promise<TeamMember[]> {
    const localDataPromise = readJsonData(localFileName);

    if (!collectionRef) {
        console.warn(`Admin SDK not initialized. Reading from local file: ${localFileName}`);
        const localData = await localDataPromise;
        return localData.map((item: any, index: number) => ({ ...item, id: item.id || `local-${index}`, order: item.order ?? index}));
    }

    try {
        const snapshot = await getDocs(query(collectionRef));
        const localData = await localDataPromise;
        
        // Force sync if counts don't match or Firestore is empty
        if (snapshot.size !== localData.length) {
            await syncCollectionFromLocal(collectionRef, localFileName);
            const newSnapshot = await getDocs(query(collectionRef, orderBy("order", "asc")));
             return newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
        }

        const q = query(collectionRef, orderBy("order", "asc"));
        const finalSnapshot = await getDocs(q);
        return finalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
    } catch (error) {
        console.error(`Error fetching collection ${collectionRef.id} from Firestore, falling back to local file.`, error);
        const localData = await readJsonData(localFileName);
        return localData.map((item: any, index: number) => ({ ...item, id: item.id || `fallback-${index}`, order: item.order ?? index }));
    }
}

async function saveCollectionData(
    collectionRef: ReturnType<typeof getCandidatesCollectionRef>,
    localFileName: string,
    items: TeamMember[]
): Promise<void> {
    
    const dataToSave = items.map(({ ...rest }) => rest);
    await fs.writeFile(path.join(process.cwd(), 'data', localFileName), JSON.stringify(dataToSave, null, 2), 'utf-8');

    if (!collectionRef) {
        console.warn(`Admin SDK not initialized, changes saved only to ${localFileName}.`);
        return;
    }
    
    const batch = writeBatch(collectionRef.firestore);
    const snapshot = await getDocs(collectionRef);
    
    snapshot.docs.forEach(doc => {
        if (!items.some(item => item.id === doc.id)) {
            batch.delete(doc.ref);
        }
    });

    items.forEach((item, index) => {
        const docRef = doc(collectionRef, item.id);
        batch.set(docRef, { ...item, order: index });
    });
    
    await batch.commit();
}


export async function getCandidates(): Promise<TeamMember[]> {
    const collectionRef = getCandidatesCollectionRef();
    return getCollectionData(collectionRef, 'candidates.json');
}

export async function saveCandidates(candidates: TeamMember[]): Promise<void> {
    const collectionRef = getCandidatesCollectionRef();
    await saveCollectionData(collectionRef, 'candidates.json', candidates);
}

export async function getOrganization(): Promise<TeamMember[]> {
    const collectionRef = getOrganizationCollectionRef();
    return getCollectionData(collectionRef, 'organization.json');
}

export async function saveOrganization(organization: TeamMember[]): Promise<void> {
    const collectionRef = getOrganizationCollectionRef();
    await saveCollectionData(collectionRef, 'organization.json', organization);
}

// Deprecated functions - no longer used
async function getHomepageDocRef() { return null; }
async function getHomepageData() { return {}; }
async function saveHomepageData(data: any) {}
