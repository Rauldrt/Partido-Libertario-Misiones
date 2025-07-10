
'use server';

import fs from 'fs/promises';
import path from 'path';

export interface ReferenteData {
  id: string;
  locality: string;
  name: string;
  phone: string; // WhatsApp number, e.g., 5493764123456
}

const referentesFilePath = path.join(process.cwd(), 'data', 'referentes.json');

export async function getReferentes(): Promise<ReferenteData[]> {
  try {
    const data = await fs.readFile(referentesFilePath, 'utf-8');
    const items: Omit<ReferenteData, 'id'>[] = JSON.parse(data);
    // Add unique IDs for React keys
    return items.map((item, index) => ({ id: `ref-${index}`, ...item }));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(referentesFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error('Failed to read referentes data:', error);
    throw new Error('Could not retrieve referentes.');
  }
}

export async function saveReferentes(referentes: Omit<ReferenteData, 'id'>[]): Promise<void> {
    try {
        await fs.writeFile(referentesFilePath, JSON.stringify(referentes, null, 2), 'utf-8');
    } catch (error) {
        console.error('Failed to write referentes data:', error);
        throw new Error('Could not save referentes.');
    }
}
