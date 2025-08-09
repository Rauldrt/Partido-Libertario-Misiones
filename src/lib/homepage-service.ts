
'use server';

import { getDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Types for Banner Slides
export interface BannerCtaData {
    text: string;
    link: string;
    accordionTarget?: string;
}

export interface BannerSlideData {
    id: string;
    title: string;
    description: string;
    cta: BannerCtaData;
    expiresAt?: string;
    imageUrl?: string;
    videoUrl?: string;
    embedCode?: string;
}

// Types for Mosaic Tiles
export interface MosaicImageData {
    id: string;
    src: string;
    alt: string;
    hint: string;
    caption: string;
}

export interface MosaicTileData {
    id: string;
    layout: string;
    duration: number;
    animation: string;
    images: MosaicImageData[];
}

// Types for Accordion Items
export interface AccordionItemData {
    id: string;
    value: string;
    title: string;
    icon: string;
    content: string;
}

// Types for Info Section
export interface InfoSectionData {
    title: string;
    description: string;
}

// Firestore document reference for homepage data
const getHomepageDocRef = () => {
    const db = getDb();
    if (!db) throw new Error("Firestore is not initialized.");
    // Store all homepage-related data in a single document for simplicity
    return doc(db, 'site-config', 'homepage');
};

async function getHomepageData(): Promise<any> {
    const docRef = getHomepageDocRef();
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    // If the document doesn't exist, we can return a default structure.
    // In a real app, you might want to initialize this from the old JSON files once.
    console.log("Homepage config document not found in Firestore. Returning default empty structure.");
    return {
        banner: [],
        mosaic: [],
        accordion: [],
        infoSection: { title: 'El Camino de la Libertad', description: 'Nuestros principios y cómo podés participar.' }
    };
}

async function saveHomepageData(data: any): Promise<void> {
    const docRef = getHomepageDocRef();
    await setDoc(docRef, data, { merge: true });
}


// Banner Functions
export async function getBannerSlides(): Promise<BannerSlideData[]> {
    const data = await getHomepageData();
    return data.banner || [];
}

export async function saveBannerSlides(slides: BannerSlideData[]): Promise<void> {
    await saveHomepageData({ banner: slides });
}


// Mosaic Functions
export async function getMosaicTiles(): Promise<MosaicTileData[]> {
    const data = await getHomepageData();
    return data.mosaic || [];
}

export async function saveMosaicTiles(tiles: MosaicTileData[]): Promise<void> {
    await saveHomepageData({ mosaic: tiles });
}

// Accordion Functions
export async function getAccordionItems(): Promise<AccordionItemData[]> {
    const data = await getHomepageData();
    const items = data.accordion || [];
    // Dynamically generate `value` from title for accordion functionality
    return items.map((item: any) => ({
      ...item,
      value: item.title.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }));
}

export async function saveAccordionItems(items: AccordionItemData[]): Promise<void> {
    // Strip value before saving as it's generated dynamically
    const dataToSave = items.map(({ value, ...rest }) => rest);
    await saveHomepageData({ accordion: dataToSave });
}

// Info Section Functions
export async function getInfoSectionData(): Promise<InfoSectionData> {
    const data = await getHomepageData();
    return data.infoSection || { title: '', description: '' };
}

export async function saveInfoSectionData(data: InfoSectionData): Promise<void> {
    await saveHomepageData({ infoSection: data });
}
