
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';

export interface TeamMember {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    role?: string; // Optional for candidates
}

// Helper to read local JSON files
async function readJsonData(fileName: string): Promise<any> {
    const filePath = path.join(process.cwd(), 'data', fileName);
    try {
        await fs.access(filePath);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        // Return null if the file is empty or just an empty array string
        if (!fileContent.trim() || fileContent.trim() === '[]') {
            return null;
        }
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.warn(`File ${fileName} not found. Returning null.`);
            return null;
        }
        console.error(`Error reading or parsing ${fileName}:`, error);
        return null;
    }
}

const getHomepageDocRef = () => {
    const db = getAdminDb();
    if (!db) return null;
    return doc(db, 'site-config', 'homepage');
};

async function getHomepageData(): Promise<any> {
    const docRef = getHomepageDocRef();

    const loadFromLocal = async () => {
        const candidates = await readJsonData('candidates.json');
        const organization = await readJsonData('organization.json');
        // Return an object with keys, even if values are null
        return { candidates, organization };
    }

    if (!docRef) {
        console.warn("Firestore Admin SDK not initialized. Falling back to local data files for homepage config.");
        return loadFromLocal();
    }

    try {
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            console.log("Firestore document 'homepage' not found. Seeding from local files...");
            const dataToSeed = await loadFromLocal();
            // Only seed if there is actually data to seed
            if (dataToSeed.candidates || dataToSeed.organization) {
                await setDoc(docRef, dataToSeed);
                console.log("Firestore document 'homepage' created and seeded successfully.");
            }
            return dataToSeed;
        }
        
        // Document exists, check if any field is missing and needs seeding
        const firestoreData = docSnap.data();
        let needsUpdate = false;
        
        if (!firestoreData.candidates) {
            const localCandidates = await readJsonData('candidates.json');
            if (localCandidates) {
                console.log("Firestore 'homepage' doc is missing 'candidates' field. Seeding from local file...");
                firestoreData.candidates = localCandidates;
                needsUpdate = true;
            }
        }
        
        if (!firestoreData.organization) {
            const localOrganization = await readJsonData('organization.json');
            if (localOrganization) {
                console.log("Firestore 'homepage' doc is missing 'organization' field. Seeding from local file...");
                firestoreData.organization = localOrganization;
                needsUpdate = true;
            }
        }

        if(needsUpdate) {
             console.log("Updating Firestore 'homepage' doc with missing fields...");
             await setDoc(docRef, firestoreData, { merge: true });
             console.log("Firestore document updated successfully.");
        }

        return firestoreData;

    } catch (error) {
        console.error("Error fetching homepage data from Firestore, falling back to local files:", error);
        return loadFromLocal();
    }
}

async function saveHomepageData(data: any): Promise<void> {
    const docRef = getHomepageDocRef();
    if (docRef) {
        await setDoc(docRef, data, { merge: true });
        return;
    }

    console.warn("Admin SDK not initialized, saving data to local files.");
    
    if (data.candidates) {
        await fs.writeFile(path.join(process.cwd(), 'data', 'candidates.json'), JSON.stringify(data.candidates, null, 2), 'utf-8');
    }
    if (data.organization) {
        await fs.writeFile(path.join(process.cwd(), 'data', 'organization.json'), JSON.stringify(data.organization, null, 2), 'utf-8');
    }
}

// Candidates Functions
export async function getCandidates(): Promise<TeamMember[]> {
    const data = await getHomepageData();
    const candidates = data?.candidates || [];
    return candidates.map((c: any, index: number) => ({ ...c, id: c.id || `cand-${index}-${Date.now()}` }));
}

export async function saveCandidates(candidates: TeamMember[]): Promise<void> {
    await saveHomepageData({ candidates });
}

// Organization Functions
export async function getOrganization(): Promise<TeamMember[]> {
    const data = await getHomepageData();
    const organization = data?.organization || [];
    return organization.map((o: any, index: number) => ({ ...o, id: o.id || `org-${index}-${Date.now()}` }));
}

export async function saveOrganization(organization: TeamMember[]): Promise<void> {
    await saveHomepageData({ organization });
}
