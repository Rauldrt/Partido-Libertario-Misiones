
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const SocialLinkSchema = z.object({
    id: z.string(),
    label: z.string(),
    embedUrl: z.string().url(),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;

const linksFilePath = path.join(process.cwd(), 'data', 'social-links.json');

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const data = await fs.readFile(linksFilePath, 'utf-8');
    const linksData = JSON.parse(data);
    
    // Validate the data just in case
    const parsed = z.array(SocialLinkSchema).safeParse(linksData);
    if(parsed.success) {
        return parsed.data;
    }
    
    // If invalid or empty, return default
    console.warn("Social links data is invalid, returning empty array.");
    return [];

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, create it with an empty array
      await fs.writeFile(linksFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error(`Failed to read data from ${linksFilePath}:`, error);
    // On other errors, return default data to prevent crashes
    return [];
  }
}

export async function saveSocialLinks(data: SocialLink[]): Promise<void> {
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
