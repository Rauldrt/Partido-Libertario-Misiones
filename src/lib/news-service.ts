
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
    const newsItems = JSON.parse(data);
    return newsItems;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Failed to read news data:', error);
    throw new Error('Could not retrieve news items.');
  }
}

export async function addNewsItem(item: Omit<NewsCardData, 'id' | 'linkUrl'>): Promise<NewsCardData> {
  const allItems = await getNewsItems();
  
  const newItemId = Date.now().toString();
  
  const newItem: NewsCardData = {
    ...item,
    id: newItemId,
    linkUrl: `/news/${newItemId}`
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
