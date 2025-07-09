
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const SocialLinkSchema = z.object({
    id: z.string(),
    label: z.string(),
    embedCode: z.string(),
});

// This is the type that will be used in the components, which can have extra fields
// that are not saved to the file, like the old 'width' and 'height'.
export type SocialLink = z.infer<typeof SocialLinkSchema> & {
    width?: string;
    height?: string;
};


const linksFilePath = path.join(process.cwd(), 'data', 'social-links.json');

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const data = await fs.readFile(linksFilePath, 'utf-8');
    const linksData = JSON.parse(data);
    
    // We use passthrough() to allow extra fields (like width/height) during parsing
    // even if they are not defined in the base schema. This prevents validation errors
    // if the old fields still exist in the data file.
    const parsed = z.array(SocialLinkSchema.passthrough()).safeParse(linksData);
    if(parsed.success) {
        return parsed.data;
    }
    
    console.warn("Social links data is invalid, returning empty array.", parsed.error.issues);
    return [];

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(linksFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error(`Failed to read data from ${linksFilePath}:`, error);
    return [];
  }
}

export async function saveSocialLinks(data: Pick<SocialLink, 'id' | 'label' | 'embedCode'>[]): Promise<void> {
    const validation = z.array(SocialLinkSchema).safeParse(data);

    if (!validation.success) {
        throw new Error('Invalid social links data provided.');
    }

    try {
        await fs.writeFile(linksFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Failed to write data to ${linksFilePath}:`, error);
        throw new Error(`Could not save social links data to ${linksFilePath}.`);
    }
}
