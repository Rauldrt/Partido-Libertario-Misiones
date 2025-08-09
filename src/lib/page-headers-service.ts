
'use server';

import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

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

const getPageHeadersDocRef = () => {
    const db = getDb();
    if (!db) throw new Error("Firestore is not initialized.");
    return doc(db, 'site-config', 'pageHeaders');
};

export async function getAllPageHeaders(): Promise<PageHeadersData> {
    const docSnap = await getDoc(getPageHeadersDocRef());
    if (docSnap.exists()) {
        return docSnap.data() as PageHeadersData;
    }
    return {};
}

export async function getPageHeaderData(pageKey: string): Promise<PageHeaderData | undefined> {
    const allData = await getAllPageHeaders();
    return allData[pageKey];
}

export async function saveAllPageHeaders(data: PageHeadersData): Promise<void> {
    const PageHeadersSchema = z.record(z.string(), PageHeaderSchema);
    const validation = PageHeadersSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de encabezados inválidos.');
    }

    await setDoc(getPageHeadersDocRef(), validation.data);
}
