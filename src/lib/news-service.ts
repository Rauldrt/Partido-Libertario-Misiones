
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

/**
 * NOTE: This is a simplified data service for demonstration purposes.
 * In a production application, you would use a database like Firestore,
 * PostgreSQL, or MySQL instead of a JSON file.
 */

export async function getNewsItems(): Promise<NewsCardData[]> {
  try {
    const data = await fs.readFile(newsFilePath, 'utf-8');
    const newsItems: NewsCardData[] = JSON.parse(data);
    // Ensure backward compatibility for items without the 'published' flag
    return newsItems.map(item => ({
      ...item,
      published: item.published !== false, // Defaults to true if undefined
    }));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, create it with an empty array
      await fs.writeFile(newsFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error('Failed to read news data:', error);
    throw new Error('Could not retrieve news items.');
  }
}

export async function getNewsItemById(id: string): Promise<NewsCardData | undefined> {
  const allItems = await getNewsItems();
  return allItems.find((item) => item.id === id);
}

export async function addNewsItem(item: Omit<NewsCardData, 'id' | 'linkUrl' | 'published'>): Promise<NewsCardData> {
  const allItems = await getNewsItems();
  
  const newItemId = Date.now().toString();
  
  const newItem: NewsCardData = {
    ...item,
    id: newItemId,
    linkUrl: `/news/${newItemId}`,
    published: true,
  };

  const updatedItems = [newItem, ...allItems];

  try {
    await fs.writeFile(newsFilePath, JSON.stringify(updatedItems, null, 2), 'utf-8');
    return newItem;
  } catch (error) {
    console.error('Failed to write news data:', error);
    throw new Error('Could not save the new item.');
  }
}

export async function updateNewsItem(id: string, updates: Partial<Omit<NewsCardData, 'id'>>): Promise<NewsCardData> {
  const allItems = await getNewsItems();
  const itemIndex = allItems.findIndex(i => i.id === id);

  if (itemIndex === -1) {
    throw new Error(`Item with id ${id} not found.`);
  }

  // Preserve the original linkUrl, but allow other fields to be updated
  const updatedItem = { ...allItems[itemIndex], ...updates, linkUrl: allItems[itemIndex].linkUrl };
  allItems[itemIndex] = updatedItem;

  try {
    await fs.writeFile(newsFilePath, JSON.stringify(allItems, null, 2), 'utf-8');
    return updatedItem;
  } catch (error) {
    console.error('Failed to write news data:', error);
    throw new Error('Could not update the item.');
  }
}

export async function deleteNewsItem(id: string): Promise<{ success: boolean }> {
  let allItems = await getNewsItems();
  const initialLength = allItems.length;
  allItems = allItems.filter(i => i.id !== id);
  
  if(allItems.length === initialLength) {
    console.warn(`Item with id ${id} not found for deletion.`);
    return { success: false };
  }

  try {
    await fs.writeFile(newsFilePath, JSON.stringify(allItems, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Failed to write news data:', error);
    throw new Error('Could not delete the item.');
  }
}

export async function reorderNewsItems(orderedIds: string[]): Promise<void> {
  const allItems = await getNewsItems();
  const itemsById = new Map(allItems.map(item => [item.id, item]));
  
  const reorderedItems: NewsCardData[] = [];
  const foundIds = new Set<string>();

  // Create the new ordered list
  for (const id of orderedIds) {
    const item = itemsById.get(id);
    if (item) {
      reorderedItems.push(item);
      foundIds.add(id);
    }
  }

  // Add any items that were not in the orderedIds list to the end of the list to prevent data loss.
  for (const item of allItems) {
    if (!foundIds.has(item.id)) {
      reorderedItems.push(item);
    }
  }
  
  try {
    await fs.writeFile(newsFilePath, JSON.stringify(reorderedItems, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write reordered news data:', error);
    throw new Error('Could not save the reordered items.');
  }
}


export async function duplicateNewsItem(id: string): Promise<NewsCardData> {
  const allItems = await getNewsItems();
  const originalItem = allItems.find(i => i.id === id);

  if (!originalItem) {
    throw new Error(`Item with id ${id} not found.`);
  }

  const newItemId = Date.now().toString();
  const newItem: NewsCardData = {
    ...originalItem,
    id: newItemId,
    title: `(Copia) ${originalItem.title}`,
    published: false, // Make the copy unpublished by default
    linkUrl: `/news/${newItemId}`,
  };

  const updatedItems = [newItem, ...allItems];

  try {
    await fs.writeFile(newsFilePath, JSON.stringify(updatedItems, null, 2), 'utf-8');
    return newItem;
  } catch (error) {
    console.error('Failed to duplicate news item:', error);
    throw new Error('Could not save the duplicated item.');
  }
}
