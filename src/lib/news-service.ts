
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, orderBy, getDoc } from 'firebase/firestore';
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
        console.error("Error leyendo news.json:", error);
        return [];
    }
}

// Helper to write to local JSON file
async function writeNewsJson(data: any[]): Promise<void> {
    const sortedData = data.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
    await fs.writeFile(newsFilePath, JSON.stringify(sortedData, null, 2), 'utf-8');
}


// One-time seed function from local file
async function getNewsFromLocalJson(): Promise<NewsCardData[]> {
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

// Firestore collection reference
const getNewsCollection = () => {
  const db = getAdminDb();
  if (!db) return null;
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

export async function getNewsItems(): Promise<NewsCardData[]> {
  const newsCollection = getNewsCollection();

  if (!newsCollection) {
    console.warn("Admin SDK no inicializado, usando news.json como respaldo.");
    return getNewsFromLocalJson();
  }
  
  try {
    const q = query(newsCollection, orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("No hay noticias en Firestore. Sembrando desde el archivo local.");
      const localData = await getNewsFromLocalJson();
      if(localData.length > 0) {
        const batch = writeBatch(newsCollection.firestore);
        localData.forEach(item => {
            const docRef = doc(newsCollection, item.id);
            batch.set(docRef, toFirestore(item));
        });
        await batch.commit();
        console.log(`${localData.length} artículos sembrados en Firestore.`);
      }
      return localData;
    }
    return snapshot.docs.map(fromFirestore);
  } catch (error) {
     console.error("Error obteniendo noticias de Firestore, usando respaldo local:", error);
     return getNewsFromLocalJson();
  }
}

export async function getNewsItemById(id: string): Promise<NewsCardData | undefined> {
  const newsCollection = getNewsCollection();
  if (!newsCollection) {
    const allItems = await getNewsFromLocalJson();
    return allItems.find(item => item.id === id);
  }

  try {
    const docRef = doc(newsCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return fromFirestore(docSnap);
    } 
  } catch (error) {
     console.error(`Error obteniendo el artículo ${id} de Firestore.`, error);
  }
  
  const allItems = await getNewsFromLocalJson();
  return allItems.find(item => item.id === id);
}

// Base function for adding/updating an item. Throws error if DB not available.
async function saveNewsItem(item: Partial<NewsCardData>): Promise<NewsCardData> {
    const newsCollection = getNewsCollection();
    if (!newsCollection) {
        console.warn("Admin SDK not initialized, guardando cambios en news.json.");
        const allItems = await getNewsFromLocalJson();
        const existingIndex = allItems.findIndex(i => i.id === item.id);
        if (existingIndex > -1) {
            allItems[existingIndex] = { ...allItems[existingIndex], ...item } as NewsCardData;
        } else {
            allItems.push(item as NewsCardData);
        }
        await writeNewsJson(allItems);
        return { ...item, linkUrl: `/news/${item.id}` } as NewsCardData;
    }
    
    const docRef = doc(newsCollection, item.id);
    await setDoc(docRef, toFirestore(item), { merge: true });

    const updatedDoc = await getDoc(docRef);
    return fromFirestore(updatedDoc);
}

export async function addNewsItem(item: Omit<NewsCardData, 'id' | 'linkUrl'>): Promise<NewsCardData> {
  const allItems = await getNewsItems();
  const newOrder = allItems.length > 0 ? Math.min(...allItems.map(i => i.order)) - 1 : 0;
  
  const newItemData: Partial<NewsCardData> = {
    ...item,
    id: `${Date.now()}`,
    order: newOrder
  };
  
  return saveNewsItem(newItemData);
}

export async function updateNewsItem(id: string, updates: Partial<Omit<NewsCardData, 'id' | 'linkUrl'>>): Promise<NewsCardData> {
    const itemToUpdate = { id, ...updates };
    return saveNewsItem(itemToUpdate);
}

export async function deleteNewsItem(id: string): Promise<{ success: boolean }> {
  const newsCollection = getNewsCollection();

   if (!newsCollection) {
        console.warn(`Admin SDK not initialized, eliminando artículo ${id} de news.json.`);
        const allItems = await getNewsFromLocalJson();
        const filteredItems = allItems.filter(item => item.id !== id);
        if (allItems.length === filteredItems.length) {
            return { success: false }; // Item not found
        }
        await writeNewsJson(filteredItems);
        return { success: true };
   }

  const docRef = doc(newsCollection, id);
  try {
      await deleteDoc(docRef);
      return { success: true };
  } catch (error) {
      console.error(`Error eliminando el artículo ${id} de Firestore.`, error);
      return { success: false };
  }
}

export async function reorderNewsItems(orderedIds: string[]): Promise<void> {
    const newsCollection = getNewsCollection();

    if (!newsCollection) {
      console.warn("Admin SDK not initialized, reordenando en news.json.");
      const allItems = await getNewsFromLocalJson();
      const reordered = orderedIds.map((id, index) => {
        const item = allItems.find(i => i.id === id);
        if (item) {
            item.order = index;
        }
        return item;
      }).filter(Boolean) as NewsCardData[];
      await writeNewsJson(reordered);
      return;
    }
    
    const db = newsCollection.firestore;
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
