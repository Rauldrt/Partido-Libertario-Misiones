
'use server';

import fs from 'fs/promises';
import path from 'path';

export interface NewsLink {
  title: string;
  url: string;
}

export interface NewsCardData {
  id: string;
  title: string;
  date: string;
  summary: string;
  content?: string;
  imageUrl: string;
  imageHint: string;
  linkUrl: string;
  type: 'news' | 'event';
  youtubeVideoId?: string;
  published: boolean;
  embedCode?: string;
  order: number; // For ordering
  links?: NewsLink[];
}

const newsFilePath = path.join(process.cwd(), 'data', 'news.json');

// Helper to read local JSON file for seeding
async function readNewsJson(): Promise<any[]> {
    try {
        await fs.access(newsFilePath);
        const fileContent = await fs.readFile(newsFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        // Log the error for easier debugging but return empty array to prevent crashes
        console.error("CRITICAL: Error reading or parsing news.json. Check the file for syntax errors.", error);
        return [];
    }
}

// Helper to write to local JSON file
async function writeNewsJson(data: any[]): Promise<void> {
    const sortedData = data.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
    await fs.writeFile(newsFilePath, JSON.stringify(sortedData, null, 2), 'utf-8');
}


// --- Public Service Functions ---

export async function getNewsItems(): Promise<NewsCardData[]> {
    const localNews = await readNewsJson();
    return localNews.map((item, index) => {
        const id = item.id || `news-local-${index}-${Date.now()}`;
        return {
            ...item,
            id: id,
            linkUrl: `/news/${id}`,
            order: item.order ?? index,
        }
    });
}

export async function getNewsItemById(id: string): Promise<NewsCardData | undefined> {
    const allItems = await getNewsItems();
    return allItems.find(item => item.id === id);
}

// Base function for adding/updating an item, now directly writing to JSON.
async function saveNewsItem(item: Partial<NewsCardData>): Promise<NewsCardData> {
    if (!item.id) {
        throw new Error("El ID del artículo es requerido para guardarlo.");
    }
    const allItems = await getNewsItems();
    const existingIndex = allItems.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
        allItems[existingIndex] = { ...allItems[existingIndex], ...item } as NewsCardData;
    } else {
        allItems.push(item as NewsCardData);
    }
    await writeNewsJson(allItems);
    return { ...item, linkUrl: `/news/${item.id}` } as NewsCardData;
}

export async function addNewsItem(item: Omit<NewsCardData, 'id' | 'linkUrl'>): Promise<NewsCardData> {
    const allItems = await getNewsItems();
    const newOrder = allItems.length > 0 ? Math.min(...allItems.map(i => i.order)) - 1 : 0;
  
    const newItemData: Partial<NewsCardData> = {
        ...item,
        id: `news-${Date.now()}`,
        order: newOrder
    };
  
    return saveNewsItem(newItemData);
}

export async function updateNewsItem(id: string, updates: Partial<Omit<NewsCardData, 'id' | 'linkUrl'>>): Promise<NewsCardData> {
    const itemToUpdate = { id, ...updates };
    return saveNewsItem(itemToUpdate);
}

export async function deleteNewsItem(id: string): Promise<{ success: boolean }> {
    const allItems = await getNewsItems();
    const filteredItems = allItems.filter(item => item.id !== id);
    if (allItems.length === filteredItems.length) {
        return { success: false }; // Item not found
    }
    await writeNewsJson(filteredItems);
    return { success: true };
}

export async function reorderNewsItems(orderedIds: string[]): Promise<void> {
    const allItems = await getNewsItems();
    const reordered = orderedIds.map((id, index) => {
        const item = allItems.find(i => i.id === id);
        if (item) {
            item.order = index;
        }
        return item;
    }).filter(Boolean) as NewsCardData[];
    await writeNewsJson(reordered);
}

export async function duplicateNewsItem(id: string): Promise<NewsCardData> {
    const originalItem = await getNewsItemById(id);
    if (!originalItem) {
        throw new Error(`Artículo con id ${id} no encontrado.`);
    }
    const { id: originalId, linkUrl, order, ...dataToCopy } = originalItem;
    const newItemData = {
        ...dataToCopy,
        title: `(Copia) ${originalItem.title}`,
        published: false,
    };
    return addNewsItem(newItemData);
}
