
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

export interface SocialWidgetData {
    embedCode: string;
}

const widgetFilePath = path.join(process.cwd(), 'data', 'social-widget.json');

const SocialWidgetSchema = z.object({
    embedCode: z.string().trim(),
});

export async function getSocialWidgetData(): Promise<SocialWidgetData> {
  try {
    const data = await fs.readFile(widgetFilePath, 'utf-8');
    const widgetData = JSON.parse(data);
    // Validate the data just in case
    const parsed = SocialWidgetSchema.safeParse(widgetData);
    if(parsed.success) {
        return parsed.data;
    }
    // If invalid or empty, return default
    return { embedCode: '' };

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, create it with an empty object
      const defaultData = { embedCode: '' };
      await fs.writeFile(widgetFilePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    console.error(`Failed to read data from ${widgetFilePath}:`, error);
    // On other errors, return default data to prevent crashes
    return { embedCode: '' };
  }
}


export async function saveSocialWidgetData(data: SocialWidgetData): Promise<void> {
    const validation = SocialWidgetSchema.safeParse(data);

    if (!validation.success) {
        throw new Error('Invalid widget data provided.');
    }

    try {
        await fs.writeFile(widgetFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Failed to write data to ${widgetFilePath}:`, error);
        throw new Error(`Could not save widget data to ${widgetFilePath}.`);
    }
}
