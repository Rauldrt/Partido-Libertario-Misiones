
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const SocialLinkSchema = z.object({
    id: z.string(),
    label: z.string(),
    embedCode: z.string(),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;
const SocialLinksSchema = z.array(SocialLinkSchema);

const getSocialLinksDocRef = () => {
    const db = getAdminDb();
    return doc(db, 'site-config', 'socialLinks');
};

async function seedSocialLinksData() {
    const filePath = path.join(process.cwd(), 'data', 'social-links.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const localData = JSON.parse(fileContent);
        const validatedData = SocialLinksSchema.parse(localData);
        await setDoc(getSocialLinksDocRef(), { links: validatedData });
        console.log("Successfully seeded social links data.");
        return validatedData;
    } catch (error) {
        console.error("Error seeding social links data, returning empty array:", error);
        return [];
    }
}


export async function getSocialLinks(): Promise<SocialLink[]> {
    const docSnap = await getDoc(getSocialLinksDocRef());
    if (docSnap.exists() && docSnap.data().links) {
        return docSnap.data().links;
    }
    return await seedSocialLinksData();
}

export async function saveSocialLinks(data: SocialLink[]): Promise<void> {
    const validation = SocialLinksSchema.safeParse(data);
    if (!validation.success) {
        throw new Error('Invalid social links data provided.');
    }
    await setDoc(getSocialLinksDocRef(), { links: validation.data });
}
