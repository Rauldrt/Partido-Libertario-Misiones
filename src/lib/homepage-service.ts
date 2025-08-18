
'use server';

import fs from 'fs/promises';
import path from 'path';

// Helper to read local JSON files for seeding
async function readJsonData(fileName: string): Promise<any> {
    const filePath = path.join(process.cwd(), 'data', fileName);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent.trim() ? JSON.parse(fileContent) : null;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.warn(`Archivo de datos no encontrado: ${fileName}. Se devolverá null.`);
            return null; 
        }
        console.error(`Error al leer o analizar ${fileName}:`, error);
        return null;
    }
}

// Helper to write to local JSON files
async function writeJsonData(fileName: string, data: any): Promise<void> {
    const filePath = path.join(process.cwd(), 'data', fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
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


// Banner Functions
export async function getBannerSlides(): Promise<BannerSlideData[]> {
    const data = await readJsonData('banner.json');
    return (data || []).map((slide: any, index: number) => ({...slide, id: slide.id || `banner-${index}-${Date.now()}`}));
}

export async function saveBannerSlides(slides: BannerSlideData[]): Promise<void> {
    await writeJsonData('banner.json', slides);
}


// Mosaic Functions
export async function getMosaicTiles(): Promise<MosaicTileData[]> {
    const data = await readJsonData('mosaic.json');
    return (data || []).map((tile: any, index: number) => ({
      ...tile,
      id: tile.id || `tile-${index}-${Date.now()}`,
      images: (tile.images || []).map((img: any, imgIndex: number) => ({
        ...img,
        id: img.id || `img-mosaic-${index}-${Date.now()}-${imgIndex}-${Date.now()}`,
      })),
    }));
}

export async function saveMosaicTiles(tiles: MosaicTileData[]): Promise<void> {
    await writeJsonData('mosaic.json', tiles);
}

// Accordion Functions
export async function getAccordionItems(): Promise<AccordionItemData[]> {
    const data = await readJsonData('accordion.json');
    return (data || []).map((item: any, index: number) => ({
      ...item,
      id: item.id || `accordion-${index}-${Date.now()}`,
      value: item.title.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }));
}

export async function saveAccordionItems(items: AccordionItemData[]): Promise<void> {
    // The 'value' property is client-side only for the accordion state, so we strip it before saving.
    const dataToSave = items.map(({ value, ...rest }) => rest);
    await writeJsonData('accordion.json', dataToSave);
}

// Info Section Functions
export async function getInfoSectionData(): Promise<InfoSectionData> {
    const data = await readJsonData('info-section.json');
    return data || { title: 'Título por Defecto', description: 'Descripción por defecto.' };
}

export async function saveInfoSectionData(data: InfoSectionData): Promise<void> {
    await writeJsonData('info-section.json', data);
}
