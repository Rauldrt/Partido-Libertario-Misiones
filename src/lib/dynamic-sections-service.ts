
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
        return { candidates, organization };
    }

    if (!docRef) {
        return loadFromLocal();
    }

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            let needsUpdate = false;
            let dataToSeed = { ...data };
            
            const localCandidates = await readJsonData('candidates.json');
            if (!data.candidates && localCandidates) {
                console.log("Firestore document 'homepage' is missing 'candidates' field. Seeding from local file...");
                dataToSeed.candidates = localCandidates;
                needsUpdate = true;
            }
            
            const localOrganization = await readJsonData('organization.json');
            if (!data.organization && localOrganization) {
                console.log("Firestore document 'homepage' is missing 'organization' field. Seeding from local file...");
                dataToSeed.organization = localOrganization;
                needsUpdate = true;
            }

            if(needsUpdate) {
                 await setDoc(docRef, dataToSeed, { merge: true });
            }
            return dataToSeed;

        } else {
            console.log("Firestore document 'homepage' not found. Seeding from local files...");
            const dataToSeed = await loadFromLocal();
            // Only seed if there is actually data to seed
            if (dataToSeed.candidates || dataToSeed.organization) {
                await setDoc(docRef, dataToSeed);
            }
            return dataToSeed;
        }
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
