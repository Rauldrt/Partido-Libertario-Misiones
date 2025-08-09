
'use server';

import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

export interface SocialWidgetData {
    embedCode: string;
}

const SocialWidgetSchema = z.object({
    embedCode: z.string().trim(),
});

const getWidgetDocRef = () => {
    const db = getDb();
    if (!db) throw new Error("Firestore is not initialized.");
    return doc(db, 'site-config', 'socialWidget');
};


export async function getSocialWidgetData(): Promise<SocialWidgetData> {
    const docSnap = await getDoc(getWidgetDocRef());
    if (docSnap.exists()) {
        const parsed = SocialWidgetSchema.safeParse(docSnap.data());
        if(parsed.success) {
            return parsed.data;
        }
    }
    return { embedCode: '' };
}


export async function saveSocialWidgetData(data: SocialWidgetData): Promise<void> {
    const validation = SocialWidgetSchema.safeParse(data);

    if (!validation.success) {
        throw new Error('Invalid widget data provided.');
    }

    await setDoc(getWidgetDocRef(), validation.data);
}
