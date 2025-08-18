
'use server';

import fs from 'fs/promises';
import path from 'path';

export interface ReferenteData {
  id: string;
  locality: string;
  name: string;
  phone: string;
}

const referentesFilePath = path.join(process.cwd(), 'data', 'referentes.json');

async function readReferentesJson(): Promise<any[]> {
    try {
        const fileContent = await fs.readFile(referentesFilePath, 'utf-8');
        return fileContent.trim() ? JSON.parse(fileContent) : [];
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Error leyendo referentes.json:", error);
        return [];
    }
}

export async function getReferentes(): Promise<ReferenteData[]> {
    const localData = await readReferentesJson();
    return localData.map((item: any, index: number) => ({ id: `ref-${index}-${Date.now()}`, ...item }));
}

export async function saveReferentes(referentes: Omit<ReferenteData, 'id'>[]): Promise<void> {
    await fs.writeFile(referentesFilePath, JSON.stringify(referentes, null, 2), 'utf-8');
}
