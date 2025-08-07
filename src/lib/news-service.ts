
'use server';

import fs from 'fs/promises';
import path from 'path';

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
}

const newsFilePath = path.join(process.cwd(), 'data', 'news.json');

async function readNewsData(): Promise<NewsCardData[]> {
  try {
    const data = await fs.readFile(newsFilePath, 'utf-8');
    // Ensure that linkUrl is correctly formed for each item
    const items: NewsCardData[] = JSON.parse(data);
    return items.map(item => ({ ...item, linkUrl: `/news/${item.id}` }));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(newsFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error('Failed to read news data:', error);
    throw new Error('Could not retrieve news items.');
  }
}

async function writeNewsData(data: NewsCardData[]): Promise<void> {
    try {
        // Before writing, remove the temporary linkUrl property as it's generated dynamically
        const dataToSave = data.map(({ linkUrl, ...rest }) => rest);
        await fs.writeFile(newsFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (error) {
        console.error('Failed to write news data:', error);
        throw new Error('Could not save news items.');
    }
}


export async function getNewsItems(): Promise<NewsCardData[]> {
  return await readNewsData();
}

export async function getNewsItemById(id: string): Promise<NewsCardData | undefined> {
  const items = await readNewsData();
  return items.find((item) => item.id === id);
}

export async function addNewsItem(item: Omit<NewsCardData, 'id' | 'linkUrl'>): Promise<NewsCardData> {
  const items = await readNewsData();
  const newItem: NewsCardData = {
    ...item,
    id: `${Date.now()}`,
    linkUrl: `/news/${Date.now()}`
  };
  const updatedItems = [newItem, ...items];
  await writeNewsData(updatedItems);
  return newItem;
}

export async function updateNewsItem(id: string, updates: Partial<Omit<NewsCardData, 'id'>>): Promise<NewsCardData> {
  const items = await readNewsData();
  const itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    throw new Error('Item not found');
  }
  items[itemIndex] = { ...items[itemIndex], ...updates };
  await writeNewsData(items);
  return items[itemIndex];
}

export async function deleteNewsItem(id: string): Promise<{ success: boolean }> {
    const items = await readNewsData();
    const updatedItems = items.filter(item => item.id !== id);
    if (items.length === updatedItems.length) {
        return { success: false }; // Item not found
    }
    await writeNewsData(updatedItems);
    return { success: true };
}

export async function reorderNewsItems(orderedIds: string[]): Promise<void> {
    const items = await readNewsData();
    const orderedItems = orderedIds.map(id => items.find(item => item.id === id)).filter(Boolean) as NewsCardData[];
    // Append any items that were not in the orderedIds list (e.g., new items)
    const remainingItems = items.filter(item => !orderedIds.includes(item.id));
    await writeNewsData([...orderedItems, ...remainingItems]);
}

export async function duplicateNewsItem(id: string): Promise<NewsCardData> {
  const items = await readNewsData();
  const originalItem = items.find(item => item.id === id);

  if (!originalItem) {
    throw new Error(`Item with id ${id} not found.`);
  }

  const { id: originalId, linkUrl, ...dataToCopy } = originalItem;

  const newItem: NewsCardData = {
    ...dataToCopy,
    id: `${Date.now()}`,
    title: `(Copia) ${originalItem.title}`,
    published: false, // Duplicates are not published by default
    linkUrl: `/news/${Date.now()}` // This will be updated on read
  };
  
  const updatedItems = [newItem, ...items];
  await writeNewsData(updatedItems);
  return newItem;
}
