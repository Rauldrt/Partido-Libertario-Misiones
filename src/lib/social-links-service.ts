
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

async function readSocialLinksJson(): Promise<SocialLink[]> {
    const filePath = path.join(process.cwd(), 'data', 'social-links.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return SocialLinksSchema.parse(JSON.parse(fileContent));
    } catch (error) {
        console.error("Error leyendo social-links.json:", error);
        return [];
    }
}

const getSocialLinksDocRef = () => {
    const db = getAdminDb();
    if (!db) return null;
    return doc(db, 'site-config', 'socialLinks');
};

export async function getSocialLinks(): Promise<SocialLink[]> {
    const docRef = getSocialLinksDocRef();
    if (!docRef) {
        console.warn("Admin SDK no inicializado, usando social-links.json como respaldo.");
        return readSocialLinksJson();
    }

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().links) {
            return docSnap.data().links;
        }
        console.log("Sembrando datos de enlaces sociales desde JSON local a Firestore.");
        const localData = await readSocialLinksJson();
        await setDoc(docRef, { links: localData });
        return localData;
    } catch (error) {
        console.error("Error obteniendo enlaces sociales de Firestore, usando respaldo local:", error);
        return readSocialLinksJson();
    }
}

export async function saveSocialLinks(data: SocialLink[]): Promise<void> {
    const docRef = getSocialLinksDocRef();
    if (!docRef) {
        throw new Error("No se pueden guardar los enlaces: El SDK de administrador de Firebase no está inicializado.");
    }

    const validation = SocialLinksSchema.safeParse(data);
    if (!validation.success) {
        throw new Error('Datos de enlaces sociales inválidos.');
    }
    await setDoc(docRef, { links: validation.data });
}
