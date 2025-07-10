
'use server';

import fs from 'fs/promises';
import path from 'path';

export interface ReferenteData {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  twitterUrl?: string;
  instagramUrl?: string;
}

const referentesFilePath = path.join(process.cwd(), 'data', 'referentes.json');

async function getReferentes(): Promise<ReferenteData[]> {
  try {
    const data = await fs.readFile(referentesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(referentesFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error('Failed to read referentes data:', error);
    throw new Error('Could not retrieve referentes.');
  }
}

async function saveReferentes(referentes: ReferenteData[]): Promise<void> {
    try {
        await fs.writeFile(referentesFilePath, JSON.stringify(referentes, null, 2), 'utf-8');
    } catch (error) {
        console.error('Failed to write referentes data:', error);
        throw new Error('Could not save referentes.');
    }
}
