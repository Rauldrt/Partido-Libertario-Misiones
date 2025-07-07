
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
      return [];
    }
    console.error('Failed to read news data:', error);
    throw new Error('Could not retrieve news items.');
  }
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

export async function updateNewsItem(id: string, updates: Partial<Omit<NewsCardData, 'id' | 'linkUrl'>>): Promise<NewsCardData> {
  const allItems = await getNewsItems();
  const itemIndex = allItems.findIndex(i => i.id === id);

  if (itemIndex === -1) {
    throw new Error(`Item with id ${id} not found.`);
  }

  const updatedItem = { ...allItems[itemIndex], ...updates };
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
