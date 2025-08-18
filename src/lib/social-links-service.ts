
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const socialLinksFilePath = path.join(process.cwd(), 'data', 'social-links.json');

const SocialLinkSchema = z.object({
    id: z.string(),
    label: z.string(),
    embedCode: z.string().optional().default(''),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;
const SocialLinksSchema = z.array(SocialLinkSchema);

async function readSocialLinksJson(): Promise<SocialLink[]> {
    try {
        const fileContent = await fs.readFile(socialLinksFilePath, 'utf-8');
        return SocialLinksSchema.parse(JSON.parse(fileContent));
    } catch (error) {
         if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Error leyendo social-links.json:", error);
        return [];
    }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
    const getFromLocal = readSocialLinksJson;

    try {
        const db = await getAdminDb();
        if (!db) {
            throw new Error("Admin SDK no inicializado.");
        }
        const docRef = doc(db, 'site-config', 'socialLinks');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().links) {
            return docSnap.data().links;
        }
        console.log("Sembrando datos de enlaces sociales desde JSON local a Firestore.");
        const localData = await getFromLocal();
        await setDoc(docRef, { links: localData });
        return localData;
    } catch (error) {
        console.error("Error obteniendo enlaces sociales de Firestore, usando respaldo local:", error);
        return getFromLocal();
    }
}

export async function saveSocialLinks(data: SocialLink[]): Promise<void> {
    const db = await getAdminDb();
    const validation = SocialLinksSchema.safeParse(data);
    if (!validation.success) {
        throw new Error('Datos de enlaces sociales inválidos.');
    }
    const dataToSave = validation.data;

    if (!db) {
        console.warn("Admin SDK no inicializado, guardando enlaces sociales en social-links.json.");
        await fs.writeFile(socialLinksFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
        return;
    }
    
    const docRef = doc(db, 'site-config', 'socialLinks');
    await setDoc(docRef, { links: dataToSave });
}

