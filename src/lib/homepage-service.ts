
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';

// Helper to read local JSON files for one-time seeding
async function readJsonData(fileName: string): Promise<any> {
    const filePath = path.join(process.cwd(), 'data', fileName);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading or parsing ${fileName}:`, error);
        return [];
    }
}


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
    const db = getAdminDb();
    // Store all homepage-related data in a single document for simplicity
    return doc(db, 'site-config', 'homepage');
};

async function getHomepageData(): Promise<any> {
    const docRef = getHomepageDocRef();
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    // If the document doesn't exist, seed it from the JSON files.
    console.log("Homepage config document not found in Firestore. Seeding from local JSON files...");
    const bannerData = await readJsonData('banner.json');
    const mosaicData = await readJsonData('mosaic.json');
    const accordionData = await readJsonData('accordion.json');
    const infoSectionData = await readJsonData('info-section.json');
    
    // Add IDs to banner slides if they don't have them
    const bannerWithIds = bannerData.map((slide: any, index: number) => ({...slide, id: slide.id || `banner-${index}-${Date.now()}`}))

    const seededData = {
        banner: bannerWithIds,
        mosaic: mosaicData,
        accordion: accordionData,
        infoSection: infoSectionData,
    };
    await setDoc(docRef, seededData);
    console.log("Homepage data seeded successfully.");
    return seededData;
}

async function saveHomepageData(data: any): Promise<void> {
    const docRef = getHomepageDocRef();
    await setDoc(docRef, data, { merge: true });
}


// Banner Functions
export async function getBannerSlides(): Promise<BannerSlideData[]> {
    const data = await getHomepageData();
    // Add IDs to banner slides if they don't have them
    return (data.banner || []).map((slide: any, index: number) => ({...slide, id: slide.id || `banner-${index}-${Date.now()}`}));
}

export async function saveBannerSlides(slides: BannerSlideData[]): Promise<void> {
    await saveHomepageData({ banner: slides });
}


// Mosaic Functions
export async function getMosaicTiles(): Promise<MosaicTileData[]> {
    const data = await getHomepageData();
    // Add IDs for dnd-kit compatibility
    return (data.mosaic || []).map((tile: any, index: number) => ({
      ...tile,
      id: tile.id || `tile-${index}-${Date.now()}`,
      images: (tile.images || []).map((img: any, imgIndex: number) => ({
        ...img,
        id: img.id || `img-mosaic-${index}-${Date.now()}-${imgIndex}-${Date.now()}`,
      })),
    }));
}

export async function saveMosaicTiles(tiles: MosaicTileData[]): Promise<void> {
    await saveHomepageData({ mosaic: tiles });
}

// Accordion Functions
export async function getAccordionItems(): Promise<AccordionItemData[]> {
    const data = await getHomepageData();
    const items = data.accordion || [];
    // Dynamically generate `value` from title for accordion functionality
    return items.map((item: any, index: number) => ({
      ...item,
      id: item.id || `accordion-${index}-${Date.now()}`,
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
