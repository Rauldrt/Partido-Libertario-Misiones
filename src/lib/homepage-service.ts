
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { LucideIcon } from 'lucide-react';

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
    expiresAt?: string; // Optional expiration date string (e.g., "YYYY-MM-DD")
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
    icon: string; // Icon name from lucide-react
    content: string;
}

// Types for Info Section
export interface InfoSectionData {
    title: string;
    description: string;
}


const bannerFilePath = path.join(process.cwd(), 'data', 'banner.json');
const mosaicFilePath = path.join(process.cwd(), 'data', 'mosaic.json');
const accordionFilePath = path.join(process.cwd(), 'data', 'accordion.json');
const infoSectionFilePath = path.join(process.cwd(), 'data', 'info-section.json');


async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const items: T[] = JSON.parse(data);
    // Add unique IDs if they don't exist, for dnd-kit compatibility
    return items.map((item, index) => ({ id: (item as any).id || `${filePath}-${index}-${Date.now()}`, ...item }));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error(`Failed to read data from ${filePath}:`, error);
    throw new Error(`Could not retrieve items from ${filePath}.`);
  }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
    try {
        // Strip the temporary 'id' field before writing back to the file
        const dataToSave = data.map(({ id, ...rest }: any) => rest);
        await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Failed to write data to ${filePath}:`, error);
        throw new Error(`Could not save items to ${filePath}.`);
    }
}


// Banner Functions
export async function getBannerSlides(): Promise<BannerSlideData[]> {
  return readData<BannerSlideData>(bannerFilePath);
}

export async function saveBannerSlides(slides: BannerSlideData[]): Promise<void> {
  await writeData(bannerFilePath, slides);
}


// Mosaic Functions
export async function getMosaicTiles(): Promise<MosaicTileData[]> {
  return readData<MosaicTileData>(mosaicFilePath);
}

export async function saveMosaicTiles(tiles: MosaicTileData[]): Promise<void> {
  await writeData(mosaicFilePath, tiles);
}

// Accordion Functions
export async function getAccordionItems(): Promise<AccordionItemData[]> {
  const items = await readData<Omit<AccordionItemData, 'value'>>(accordionFilePath);
  // Dynamically generate `value` from title for accordion functionality
  return items.map(item => ({
    ...item,
    value: item.title.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }));
}

export async function saveAccordionItems(items: AccordionItemData[]): Promise<void> {
    // Strip id and value before saving
    const dataToSave = items.map(({ id, value, ...rest }) => rest);
    await fs.writeFile(accordionFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
}

// Info Section Functions
export async function getInfoSectionData(): Promise<InfoSectionData> {
    try {
        const data = await fs.readFile(infoSectionFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            const defaultData: InfoSectionData = {
                title: 'El Camino de la Libertad',
                description: 'Nuestros principios y cómo podés participar.'
            };
            await fs.writeFile(infoSectionFilePath, JSON.stringify(defaultData, null, 2), 'utf-8');
            return defaultData;
        }
        console.error(`Failed to read data from ${infoSectionFilePath}:`, error);
        throw new Error(`Could not retrieve data from ${infoSectionFilePath}.`);
    }
}

export async function saveInfoSectionData(data: InfoSectionData): Promise<void> {
    try {
        await fs.writeFile(infoSectionFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Failed to write data to ${infoSectionFilePath}:`, error);
        throw new Error(`Could not save data to ${infoSectionFilePath}.`);
    }
}
