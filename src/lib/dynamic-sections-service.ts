
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, doc, getDocs, writeBatch, query, orderBy } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';

export interface TeamMember {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    role?: string; // Optional for candidates
    order?: number; // For ordering
}

// Helper to read local JSON files
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

// Generic function to seed a collection from a local file if it's empty
async function seedCollectionIfEmpty(
    collectionRef: ReturnType<typeof getCandidatesCollectionRef>,
    localFileName: string
) {
    if (!collectionRef) return;

    const snapshot = await getDocs(query(collectionRef));
    if (snapshot.empty) {
        console.log(`Collection '${collectionRef.id}' is empty in Firestore. Seeding from '${localFileName}'...`);
        const localData = await readJsonData(localFileName);
        
        if (localData && localData.length > 0) {
            const batch = writeBatch(collectionRef.firestore);
            localData.forEach((item: any, index: number) => {
                const id = item.id || `${collectionRef.id.slice(0, -1)}-${index}-${Date.now()}`;
                const docRef = doc(collectionRef, id);
                batch.set(docRef, { ...item, id, order: item.order ?? index });
            });
            await batch.commit();
            console.log(`Seeded ${localData.length} documents into '${collectionRef.id}'.`);
        }
    }
}

async function getCollectionData(
    collectionRef: ReturnType<typeof getCandidatesCollectionRef>,
    localFileName: string
): Promise<TeamMember[]> {
    if (!collectionRef) {
        console.warn(`Admin SDK not initialized. Reading from local file: ${localFileName}`);
        const localData = await readJsonData(localFileName);
        return localData.map((item: any, index: number) => ({ ...item, id: item.id || `local-${index}`, order: item.order ?? index}));
    }

    try {
        await seedCollectionIfEmpty(collectionRef, localFileName);
        const q = query(collectionRef, orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
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
    
    // Always write to local file as a backup
    const dataToSave = items.map(({ ...rest }) => rest);
    await fs.writeFile(path.join(process.cwd(), 'data', localFileName), JSON.stringify(dataToSave, null, 2), 'utf-8');

    if (!collectionRef) {
        console.warn(`Admin SDK not initialized, changes saved only to ${localFileName}.`);
        return;
    }
    
    const batch = writeBatch(collectionRef.firestore);
    const snapshot = await getDocs(collectionRef);
    
    // Delete documents that are no longer in the list
    snapshot.docs.forEach(doc => {
        if (!items.some(item => item.id === doc.id)) {
            batch.delete(doc.ref);
        }
    });

    // Set (create or update) all current items
    items.forEach((item, index) => {
        const docRef = doc(collectionRef, item.id);
        batch.set(docRef, { ...item, order: index });
    });
    
    await batch.commit();
}


// Candidates Functions
export async function getCandidates(): Promise<TeamMember[]> {
    const collectionRef = getCandidatesCollectionRef();
    return getCollectionData(collectionRef, 'candidates.json');
}

export async function saveCandidates(candidates: TeamMember[]): Promise<void> {
    const collectionRef = getCandidatesCollectionRef();
    await saveCollectionData(collectionRef, 'candidates.json', candidates);
}

// Organization Functions
export async function getOrganization(): Promise<TeamMember[]> {
    const collectionRef = getOrganizationCollectionRef();
    return getCollectionData(collectionRef, 'organization.json');
}

export async function saveOrganization(organization: TeamMember[]): Promise<void> {
    const collectionRef = getOrganizationCollectionRef();
    await saveCollectionData(collectionRef, 'organization.json', organization);
}

// Functions below are deprecated or no longer used for candidates/org
async function getHomepageDocRef() { return null; }
async function getHomepageData() { return {}; }
async function saveHomepageData(data: any) {}

