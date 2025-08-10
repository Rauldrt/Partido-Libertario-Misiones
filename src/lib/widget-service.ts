
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';


export interface SocialWidgetData {
    embedCode: string;
}

const SocialWidgetSchema = z.object({
    embedCode: z.string().trim(),
});

const getWidgetDocRef = () => {
    const db = getAdminDb();
    return doc(db, 'site-config', 'socialWidget');
};

async function seedWidgetData() {
    const filePath = path.join(process.cwd(), 'data', 'social-widget.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const localData = JSON.parse(fileContent);
        const validatedData = SocialWidgetSchema.parse(localData);
        await setDoc(getWidgetDocRef(), validatedData);
        console.log("Successfully seeded social widget data.");
        return validatedData;
    } catch (error) {
        console.error("Error seeding social widget data, returning empty object:", error);
        return { embedCode: '' };
    }
}

export async function getSocialWidgetData(): Promise<SocialWidgetData> {
    const docSnap = await getDoc(getWidgetDocRef());
    if (docSnap.exists()) {
        const parsed = SocialWidgetSchema.safeParse(docSnap.data());
        if(parsed.success) {
            return parsed.data;
        }
    }
    return await seedWidgetData();
}


export async function saveSocialWidgetData(data: SocialWidgetData): Promise<void> {
    const validation = SocialWidgetSchema.safeParse(data);

    if (!validation.success) {
        throw new Error('Invalid widget data provided.');
    }

    await setDoc(getWidgetDocRef(), validation.data);
}
