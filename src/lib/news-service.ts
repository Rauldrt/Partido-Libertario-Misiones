
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, orderBy } from 'firebase/firestore';
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

// Helper to read local JSON file
async function readNewsJson(): Promise<any[]> {
    try {
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
    try {
        await fs.writeFile(newsFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error escribiendo en news.json:", error);
        throw new Error("No se pudo escribir en el archivo de noticias local.");
    }
}

// One-time seed function from local file
async function getNewsFromLocalJson(): Promise<NewsCardData[]> {
    const localNews = await readNewsJson();
    return localNews.map((item, index) => {
        const id = item.id || `${Date.now()}-${index}`;
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

const toJsonSerializable = (item: Partial<NewsCardData>): any => {
    const { linkUrl, ...data } = item;
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

export async function addNewsItem(item: Omit<NewsCardData, 'id' | 'linkUrl'>): Promise<NewsCardData> {
  const allItems = await getNewsItems();
  const newOrder = allItems.length > 0 ? Math.min(...allItems.map(i => i.order)) - 1 : 0;
  
  const newItemData: Partial<NewsCardData> = {
    ...item,
    id: `${Date.now()}`,
    order: newOrder
  };
  
  const newsCollection = getNewsCollection();
  if (!newsCollection) {
      const updatedItems = [toJsonSerializable(newItemData), ...allItems.map(toJsonSerializable)];
      await writeNewsJson(updatedItems);
  } else {
      const docRef = doc(newsCollection, newItemData.id);
      await setDoc(docRef, toFirestore(newItemData));
  }
  return { ...newItemData, linkUrl: `/news/${newItemData.id}` } as NewsCardData;
}

export async function updateNewsItem(id: string, updates: Partial<Omit<NewsCardData, 'id' | 'linkUrl'>>): Promise<NewsCardData> {
  const newsCollection = getNewsCollection();
  
  if (!newsCollection) {
      let allItems = await getNewsFromLocalJson();
      const itemIndex = allItems.findIndex(item => item.id === id);
      if (itemIndex === -1) {
          throw new Error(`No se pudo encontrar el artículo con ID ${id} para actualizar.`);
      }
      const updatedItem = { ...allItems[itemIndex], ...updates };
      allItems[itemIndex] = updatedItem;
      await writeNewsJson(allItems.map(toJsonSerializable));
      return updatedItem;
  }
  
  const docRef = doc(newsCollection, id);
  await setDoc(docRef, toFirestore(updates), { merge: true });
  
  const updatedDoc = await getDoc(docRef);
  return fromFirestore(updatedDoc);
}

export async function deleteNewsItem(id: string): Promise<{ success: boolean }> {
  const newsCollection = getNewsCollection();

   if (!newsCollection) {
       let allItems = await getNewsFromLocalJson();
       const updatedItems = allItems.filter(item => item.id !== id);
       if (allItems.length === updatedItems.length) {
            return { success: false };
       }
       await writeNewsJson(updatedItems.map(toJsonSerializable));
       return { success: true };
  }

  const docRef = doc(newsCollection, id);
  await deleteDoc(docRef);
  return { success: true };
}

export async function reorderNewsItems(orderedIds: string[]): Promise<void> {
    const newsCollection = getNewsCollection();

    if (!newsCollection) {
      let allItems = await getNewsFromLocalJson();
      const reordered = orderedIds.map((id, index) => {
          const item = allItems.find(i => i.id === id);
          if (!item) return null;
          return { ...item, order: index };
      }).filter((item): item is NewsCardData => !!item);
      
      const existingIds = new Set(orderedIds);
      allItems.forEach(item => {
        if (!existingIds.has(item.id)) {
            reordered.push(item);
        }
      });
      await writeNewsJson(reordered.map(toJsonSerializable));
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
