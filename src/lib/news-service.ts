
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, writeBatch, query, orderBy } from 'firebase/firestore';
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

// One-time seed function from local file
async function getNewsFromLocalJson(): Promise<NewsCardData[]> {
    const filePath = path.join(process.cwd(), 'data', 'news.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const localNews: any[] = JSON.parse(fileContent);
        return localNews.map((item, index) => ({
            ...item,
            id: item.id || `${Date.now()}-${index}`,
            linkUrl: `/news/${item.id || `${Date.now()}-${index}`}`,
            order: item.order ?? index,
        }));
    } catch (error) {
        console.error("Error leyendo news.json:", error);
        return [];
    }
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
      console.log("No hay noticias en Firestore. Usando datos locales.");
      return getNewsFromLocalJson();
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
  
  // Fallback for both not found in Firestore or Firestore error
  const allItems = await getNewsFromLocalJson();
  return allItems.find(item => item.id === id);
}

export async function addNewsItem(item: Omit<NewsCardData, 'id' | 'linkUrl'>): Promise<NewsCardData> {
  const newsCollection = getNewsCollection();
  if (!newsCollection) {
      throw new Error("No se puede añadir el artículo: El SDK de administrador de Firebase no está inicializado.");
  }
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
  const newsCollection = getNewsCollection();
  if (!newsCollection) {
      throw new Error("No se puede actualizar el artículo: El SDK de administrador de Firebase no está inicializado.");
  }
  const docRef = doc(newsCollection, id);
  await setDoc(docRef, toFirestore(updates), { merge: true });
  
  const updatedDoc = await getDoc(docRef);
  return fromFirestore(updatedDoc);
}

export async function deleteNewsItem(id: string): Promise<{ success: boolean }> {
  const newsCollection = getNewsCollection();
   if (!newsCollection) {
      throw new Error("No se puede eliminar el artículo: El SDK de administrador de Firebase no está inicializado.");
  }
  const docRef = doc(newsCollection, id);
  await deleteDoc(docRef);
  return { success: true };
}

export async function reorderNewsItems(orderedIds: string[]): Promise<void> {
    const newsCollection = getNewsCollection();
    if (!newsCollection) {
      throw new Error("No se puede reordenar: El SDK de administrador de Firebase no está inicializado.");
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
