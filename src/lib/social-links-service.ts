
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

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
    return readSocialLinksJson();
}

export async function saveSocialLinks(data: SocialLink[]): Promise<void> {
    const validation = SocialLinksSchema.safeParse(data);
    if (!validation.success) {
        throw new Error('Datos de enlaces sociales inválidos.');
    }
    await fs.writeFile(socialLinksFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
}
