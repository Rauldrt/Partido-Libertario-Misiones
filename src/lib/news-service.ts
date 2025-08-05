
'use server';

import { getDb } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

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
  createdAt: any; // Firestore timestamp or ISO string
}

const NEWS_COLLECTION = 'news';

function docToNewsItem(doc: any): NewsCardData {
    const data = doc.data();
    // Convert Firestore Timestamp to a serializable format (ISO string)
    // This makes it safe for client components and server actions.
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
    
    return {
        id: doc.id,
        title: data.title,
        date: data.date,
        summary: data.summary,
        content: data.content,
        imageUrl: data.imageUrl,
        imageHint: data.imageHint,
        linkUrl: `/news/${doc.id}`, // Dynamic linkUrl
        type: data.type,
        youtubeVideoId: data.youtubeVideoId,
        published: data.published,
        embedCode: data.embedCode,
        createdAt: createdAt,
    };
}


export async function getNewsItems(): Promise<NewsCardData[]> {
  const db = getDb();
  if (!db) {
    console.error("Firestore is not initialized.");
    return [];
  }
  
  const newsCollection = collection(db, NEWS_COLLECTION);

  try {
    const newsSnapshot = await getDocs(newsCollection);
    const newsItems = newsSnapshot.docs.map(doc => docToNewsItem(doc));
    
    // Manually sort the items by date on the server.
    newsItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return newsItems;
  } catch (error: any) {
    console.error('Failed to read news data from Firestore:', error);
    throw new Error('Could not retrieve news items.');
  }
}

export async function getNewsItemById(id: string): Promise<NewsCardData | undefined> {
  const db = getDb();
  if (!db) {
    console.error("Firestore is not initialized.");
    return undefined;
  }
  
  try {
    const docRef = doc(db, NEWS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docToNewsItem(docSnap);
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(`Failed to get item ${id}:`, error);
    return undefined;
  }
}

export async function addNewsItem(item: Omit<NewsCardData, 'id' | 'linkUrl' | 'createdAt' | 'published'>): Promise<NewsCardData> {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  
  try {
    const newItemPayload = {
      ...item,
      published: true, // Default to published
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, NEWS_COLLECTION), newItemPayload);
    
    return {
        ...newItemPayload,
        id: docRef.id,
        linkUrl: `/news/${docRef.id}`,
        createdAt: new Date().toISOString(), // Return a serializable date
    } as NewsCardData;

  } catch (error) {
    console.error('Failed to write news data to Firestore:', error);
    throw new Error('Could not save the new item.');
  }
}

export async function updateNewsItem(id: string, updates: Partial<Omit<NewsCardData, 'id'>>): Promise<NewsCardData> {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  
  try {
    const docRef = doc(db, NEWS_COLLECTION, id);
    // The 'createdAt' field should not be updated.
    const { createdAt, ...restOfUpdates } = updates;
    await updateDoc(docRef, restOfUpdates);

    const updatedDoc = await getNewsItemById(id);
    if (!updatedDoc) throw new Error("Could not retrieve updated item.");
    return updatedDoc;
  } catch (error) {
    console.error('Failed to update news data in Firestore:', error);
    throw new Error('Could not update the item.');
  }
}

export async function deleteNewsItem(id: string): Promise<{ success: boolean }> {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }

  try {
    await deleteDoc(doc(db, NEWS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete news data from Firestore:', error);
    throw new Error('Could not delete the item.');
  }
}

// Reordering now works by updating an 'order' field.
// Let's stick with createdAt for simplicity for now. Reordering can be a future feature.
export async function reorderNewsItems(orderedIds: string[]): Promise<void> {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }

  try {
    const batch = writeBatch(db);
    
    // We'll use a `createdAt` mock value to reorder. 
    // The larger the timestamp, the newer the item.
    orderedIds.forEach((id, index) => {
      const docRef = doc(db, NEWS_COLLECTION, id);
      // To ensure newest is at the top, we subtract the index from the current time
      const mockTimestamp = new Date(Date.now() - index * 1000 * 60); // Subtract 1 minute for each position
      batch.update(docRef, { createdAt: mockTimestamp });
    });

    await batch.commit();
  } catch (error) {
    console.error('Failed to reorder news data in Firestore:', error);
    throw new Error('Could not save the reordered items.');
  }
}

export async function duplicateNewsItem(id: string): Promise<NewsCardData> {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  
  const originalItem = await getNewsItemById(id);

  if (!originalItem) {
    throw new Error(`Item with id ${id} not found.`);
  }

  const { id: originalId, linkUrl, createdAt, ...dataToCopy } = originalItem;

  const duplicatedData = {
    ...dataToCopy,
    title: `(Copia) ${originalItem.title}`,
    published: false,
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(collection(db, NEWS_COLLECTION), duplicatedData);
    
     return {
        ...duplicatedData,
        id: docRef.id,
        linkUrl: `/news/${docRef.id}`,
        createdAt: new Date().toISOString(),
    } as NewsCardData;
  } catch (error) {
    console.error('Failed to duplicate news item in Firestore:', error);
    throw new Error('Could not save the duplicated item.');
  }
}
