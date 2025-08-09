
'use server';

import { getDb } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, writeBatch, query, orderBy } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
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
  order: number; // For ordering
}

// Firestore collection reference
const getNewsCollection = () => {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized. Check your Firebase configuration.");
  }
  return collection(db, 'news');
};

// Helper to convert Firestore doc to NewsCardData
const fromFirestore = (doc: any): NewsCardData => {
    const data = doc.data();
    const id = doc.id;
    return {
        id,
        linkUrl: `/news/${id}`,
        ...data,
    };
};

// Helper to convert NewsCardData to Firestore doc data
const toFirestore = (item: Partial<NewsCardData>): any => {
    const { id, linkUrl, ...data } = item;
    return data;
};

// One-time seed function
async function seedNewsDataFromLocalJson() {
    console.log("Attempting to seed news data from local JSON...");
    const db = getDb();
    if (!db) return;

    const newsCollection = getNewsCollection();
    const filePath = path.join(process.cwd(), 'data', 'news.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const localNews: any[] = JSON.parse(fileContent);
        
        const batch = writeBatch(db);
        localNews.forEach((item, index) => {
            const docRef = doc(newsCollection, item.id || `${Date.now()}-${index}`);
            const { id, ...data } = item;
            batch.set(docRef, { ...data, order: index });
        });
        await batch.commit();
        console.log(`Successfully seeded ${localNews.length} news items.`);
    } catch (error) {
        console.error("Error seeding news data:", error);
    }
}


export async function getNewsItems(): Promise<NewsCardData[]> {
  const newsCollection = getNewsCollection();
  const q = query(newsCollection, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log("No news items found in Firestore. Attempting to seed from local data...");
    await seedNewsDataFromLocalJson();
    // Re-fetch after seeding
    const newSnapshot = await getDocs(q);
    return newSnapshot.docs.map(fromFirestore);
  }
  return snapshot.docs.map(fromFirestore);
}

export async function getNewsItemById(id: string): Promise<NewsCardData | undefined> {
  const db = getDb();
  if (!db) throw new Error("Firestore not initialized.");
  const docRef = doc(db, 'news', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return fromFirestore(docSnap);
  } else {
    return undefined;
  }
}

export async function addNewsItem(item: Omit<NewsCardData, 'id' | 'linkUrl'>): Promise<NewsCardData> {
  const newsCollection = getNewsCollection();
  const allItems = await getNewsItems();
  const newOrder = allItems.length > 0 ? Math.min(...allItems.map(i => i.order)) - 1 : 0;
  
  const docRef = await addDoc(newsCollection, toFirestore({ ...item, order: newOrder }));
  return {
    ...item,
    id: docRef.id,
    linkUrl: `/news/${docRef.id}`,
    order: newOrder
  };
}

export async function updateNewsItem(id: string, updates: Partial<Omit<NewsCardData, 'id' | 'linkUrl'>>): Promise<NewsCardData> {
  const db = getDb();
  if (!db) throw new Error("Firestore not initialized.");
  const docRef = doc(db, 'news', id);
  await setDoc(docRef, toFirestore(updates), { merge: true });
  
  const updatedDoc = await getDoc(docRef);
  return fromFirestore(updatedDoc);
}

export async function deleteNewsItem(id: string): Promise<{ success: boolean }> {
  const db = getDb();
  if (!db) throw new Error("Firestore not initialized.");
  const docRef = doc(db, 'news', id);
  await deleteDoc(docRef);
  return { success: true };
}

export async function reorderNewsItems(orderedIds: string[]): Promise<void> {
    const db = getDb();
    if (!db) throw new Error("Firestore not initialized.");
    const batch = writeBatch(db);
    
    orderedIds.forEach((id, index) => {
        const docRef = doc(db, 'news', id);
        batch.update(docRef, { order: index });
    });

    await batch.commit();
}

export async function duplicateNewsItem(id: string): Promise<NewsCardData> {
  const originalItem = await getNewsItemById(id);

  if (!originalItem) {
    throw new Error(`Item with id ${id} not found.`);
  }
  
  const { id: originalId, linkUrl, order, ...dataToCopy } = originalItem;

  const newItemData = {
    ...dataToCopy,
    title: `(Copia) ${originalItem.title}`,
    published: false, // Duplicates are not published by default
  };
  
  return addNewsItem(newItemData);
}
