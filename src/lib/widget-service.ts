
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

export interface SocialWidgetData {
    embedCode: string;
}

const widgetFilePath = path.join(process.cwd(), 'data', 'social-widget.json');

const SocialWidgetSchema = z.object({
    embedCode: z.string().trim().optional().default(''),
});

async function readWidgetJson(): Promise<SocialWidgetData> {
    try {
        const fileContent = await fs.readFile(widgetFilePath, 'utf-8');
        const parsed = SocialWidgetSchema.safeParse(JSON.parse(fileContent));
        if (parsed.success) return parsed.data;
        return { embedCode: '' };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { embedCode: '' };
        }
        console.error("Error leyendo social-widget.json:", error);
        return { embedCode: '' };
    }
}

export async function getSocialWidgetData(): Promise<SocialWidgetData> {
    return readWidgetJson();
}

export async function saveSocialWidgetData(data: SocialWidgetData): Promise<void> {
    const validation = SocialWidgetSchema.safeParse(data);
    if (!validation.success) {
        throw new Error('Datos de widget inválidos.');
    }
    await fs.writeFile(widgetFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
}
