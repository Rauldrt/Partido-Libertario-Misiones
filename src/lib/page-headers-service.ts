
'use server';

import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const PageHeaderSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  backgroundImage: z.string().optional(),
  featuredImage: z.string().optional(),
  featuredImageTitle: z.string().optional(),
});

export type PageHeaderData = z.infer<typeof PageHeaderSchema>;

export type PageHeadersData = {
  [key: string]: PageHeaderData;
};

const PageHeadersSchema = z.record(z.string(), PageHeaderSchema);


const getPageHeadersDocRef = () => {
    const db = getDb();
    if (!db) throw new Error("Firestore is not initialized.");
    return doc(db, 'site-config', 'pageHeaders');
};

async function seedPageHeadersData() {
    const filePath = path.join(process.cwd(), 'data', 'page-headers.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const localData = JSON.parse(fileContent);
        const validatedData = PageHeadersSchema.parse(localData);
        await setDoc(getPageHeadersDocRef(), validatedData);
        console.log("Successfully seeded page headers data.");
        return validatedData;
    } catch (error) {
        console.error("Error seeding page headers data, returning empty object:", error);
        return {};
    }
}

export async function getAllPageHeaders(): Promise<PageHeadersData> {
    const docSnap = await getDoc(getPageHeadersDocRef());
    if (docSnap.exists()) {
        const parsed = PageHeadersSchema.safeParse(docSnap.data());
        if (parsed.success) {
            return parsed.data;
        }
    }
    return await seedPageHeadersData();
}

export async function getPageHeaderData(pageKey: string): Promise<PageHeaderData | undefined> {
    const allData = await getAllPageHeaders();
    return allData[pageKey];
}

export async function saveAllPageHeaders(data: PageHeadersData): Promise<void> {
    const validation = PageHeadersSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de encabezados inválidos.');
    }

    await setDoc(getPageHeadersDocRef(), validation.data);
}
