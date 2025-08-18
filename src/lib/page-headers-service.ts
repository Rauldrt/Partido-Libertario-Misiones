
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const pageHeadersFilePath = path.join(process.cwd(), 'data', 'page-headers.json');

// Helper to read local JSON file
async function readPageHeadersJson(): Promise<any> {
    try {
        const fileContent = await fs.readFile(pageHeadersFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return {};
        }
        console.error("Error leyendo page-headers.json:", error);
        return {}; // Return empty object on error
    }
}

const PageHeaderSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  backgroundImage: z.string().optional(),
  featuredImage: z.string().optional(),
  featuredImageTitle: z.string().optional(),
});

export type PageHeaderData = z.infer<typeof PageHeaderSchema>;
export type PageHeadersData = { [key: string]: PageHeaderData; };
const PageHeadersSchema = z.record(z.string(), PageHeaderSchema);

export async function getAllPageHeaders(): Promise<PageHeadersData> {
    const localData = await readPageHeadersJson();
    return PageHeadersSchema.parse(localData);
}

export async function getPageHeaderData(pageKey: string): Promise<PageHeaderData | undefined> {
    const allData = await getAllPageHeaders();
    return allData[pageKey];
}

export async function saveAllPageHeaders(data: PageHeadersData): Promise<void> {
    const validation = PageHeadersSchema.safeParse(data);
    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de encabezados inválidos.');
    }
    await fs.writeFile(pageHeadersFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
}
