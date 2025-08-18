
'use server';

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

const candidatesFilePath = path.join(process.cwd(), 'data', 'candidates.json');
const organizationFilePath = path.join(process.cwd(), 'data', 'organization.json');

// Helper to read local JSON files
async function readJsonData(filePath: string): Promise<any[]> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent.trim() ? JSON.parse(fileContent) : [];
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // File doesn't exist, return empty array
        }
        console.error(`Error al leer el archivo local ${path.basename(filePath)}:`, error);
        return []; // Return empty array on other errors to prevent crashes
    }
}

// Helper to write to local JSON files
async function writeJsonData(filePath: string, data: any[]): Promise<void> {
    const sortedData = data.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
    await fs.writeFile(filePath, JSON.stringify(sortedData, null, 2), 'utf-8');
}


// --- Funciones Públicas Exportadas ---

export async function getCandidates(): Promise<TeamMember[]> {
    const localData = await readJsonData(candidatesFilePath);
    return localData.map((item, index) => ({
        ...item,
        id: item.id || `cand-${index}-${Date.now()}`,
        order: item.order ?? index,
    }));
}

export async function saveCandidates(candidates: TeamMember[]): Promise<{ message: string }> {
    const dataToSave = candidates.map((item, index) => ({ ...item, order: index }));
    await writeJsonData(candidatesFilePath, dataToSave);
    return { message: `Candidatos guardados con éxito en candidates.json.` };
}

export async function getOrganization(): Promise<TeamMember[]> {
    const localData = await readJsonData(organizationFilePath);
     return localData.map((item, index) => ({
        ...item,
        id: item.id || `org-${index}-${Date.now()}`,
        order: item.order ?? index,
    }));
}

export async function saveOrganization(organization: TeamMember[]): Promise<{ message: string }> {
    const dataToSave = organization.map((item, index) => ({ ...item, order: index }));
    await writeJsonData(organizationFilePath, dataToSave);
    return { message: `Organigrama guardado con éxito en organization.json.` };
}
