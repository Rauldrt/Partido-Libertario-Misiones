
'use server';

import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

const SocialLinkSchema = z.object({
    id: z.string(),
    label: z.string(),
    embedCode: z.string(),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;

const getSocialLinksDocRef = () => {
    const db = getDb();
    if (!db) throw new Error("Firestore is not initialized.");
    return doc(db, 'site-config', 'socialLinks');
};

export async function getSocialLinks(): Promise<SocialLink[]> {
    const docSnap = await getDoc(getSocialLinksDocRef());
    if (docSnap.exists() && docSnap.data().links) {
        return docSnap.data().links;
    }
    return [];
}

export async function saveSocialLinks(data: SocialLink[]): Promise<void> {
    const validation = z.array(SocialLinkSchema).safeParse(data);
    if (!validation.success) {
        throw new Error('Invalid social links data provided.');
    }
    await setDoc(getSocialLinksDocRef(), { links: validation.data });
}
