
'use server';

import { getAdminDb } from './firebase-admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';

// Helper to read local JSON files for seeding
async function readJsonData(fileName: string): Promise<any> {
    const filePath = path.join(process.cwd(), 'data', fileName);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error al leer o analizar ${fileName}:`, error);
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
    if (!db) return null;
    return doc(db, 'site-config', 'homepage');
};

async function getHomepageData(useLocal = false): Promise<any> {
    const docRef = getHomepageDocRef();
    
    const loadFromLocal = async () => {
        const banner = await readJsonData('banner.json');
        const mosaic = await readJsonData('mosaic.json');
        const accordion = await readJsonData('accordion.json');
        const infoSection = await readJsonData('info-section.json');
        return { banner, mosaic, accordion, infoSection };
    }

    if (!docRef || useLocal) {
        return loadFromLocal();
    }

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        // If the document doesn't exist in Firestore, seed it from local files.
        console.log("Documento de configuración de inicio no encontrado en Firestore. Sembrando desde archivos JSON locales...");
        const seededData = await loadFromLocal();
        await setDoc(docRef, seededData);
        console.log("Datos de inicio sembrados en Firestore correctamente.");
        return seededData;
    } catch (error) {
        console.error("Error al obtener datos de inicio de Firestore, usando respaldo local:", error);
        return loadFromLocal();
    }
}


async function saveHomepageData(data: any): Promise<void> {
    const docRef = getHomepageDocRef();
    if (docRef) {
        await setDoc(docRef, data, { merge: true });
        return;
    }

    console.warn("Admin SDK no inicializado, guardando datos de inicio en archivos locales.");
    
    if (data.banner) {
        await fs.writeFile(path.join(process.cwd(), 'data', 'banner.json'), JSON.stringify(data.banner, null, 2), 'utf-8');
    }
    if (data.mosaic) {
        await fs.writeFile(path.join(process.cwd(), 'data', 'mosaic.json'), JSON.stringify(data.mosaic, null, 2), 'utf-8');
    }
    if (data.accordion) {
        await fs.writeFile(path.join(process.cwd(), 'data', 'accordion.json'), JSON.stringify(data.accordion, null, 2), 'utf-8');
    }
     if (data.infoSection) {
        await fs.writeFile(path.join(process.cwd(), 'data', 'info-section.json'), JSON.stringify(data.infoSection, null, 2), 'utf-8');
    }
}


// Banner Functions
export async function getBannerSlides(): Promise<BannerSlideData[]> {
    const data = await getHomepageData();
    // Ensure every slide has a unique ID for client-side rendering.
    // The || operator and Date.now() ensures that even slides without a pre-existing id get one.
    return (data.banner || []).map((slide: any, index: number) => ({...slide, id: slide.id || `banner-${index}-${Date.now()}`}));
}

export async function saveBannerSlides(slides: BannerSlideData[]): Promise<void> {
    await saveHomepageData({ banner: slides });
}


// Mosaic Functions
export async function getMosaicTiles(): Promise<MosaicTileData[]> {
    const data = await getHomepageData();
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
    return items.map((item: any, index: number) => ({
      ...item,
      id: item.id || `accordion-${index}-${Date.now()}`,
      value: item.title.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }));
}

export async function saveAccordionItems(items: AccordionItemData[]): Promise<void> {
    // The 'value' property is client-side only for the accordion state, so we strip it before saving.
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
