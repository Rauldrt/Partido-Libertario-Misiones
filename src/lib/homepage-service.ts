
'use server';

import fs from 'fs/promises';
import path from 'path';

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


const bannerFilePath = path.join(process.cwd(), 'data', 'banner.json');
const mosaicFilePath = path.join(process.cwd(), 'data', 'mosaic.json');


async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const items: T[] = JSON.parse(data);
    // Add unique IDs if they don't exist, for dnd-kit compatibility
    return items.map((item, index) => ({ id: index.toString(), ...item }));
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
        const dataWithoutIds = data.map(({ id, ...rest }: any) => rest);
        await fs.writeFile(filePath, JSON.stringify(dataWithoutIds, null, 2), 'utf-8');
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
