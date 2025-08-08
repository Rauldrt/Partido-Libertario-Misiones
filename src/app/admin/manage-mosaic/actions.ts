
'use server';

import { z } from 'zod';
import { saveMosaicTiles, type MosaicTileData } from '@/lib/homepage-service';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

const MosaicImageSchema = z.object({
  id: z.string(),
  src: z.string().min(1, 'La URL de la imagen es requerida.'),
  alt: z.string().min(1, 'El texto alternativo es requerido.'),
  hint: z.string().optional().default(''), // Make hint optional and provide a default
  caption: z.string().min(1, 'La leyenda es requerida.'),
});

const MosaicTileSchema = z.object({
  id: z.string(),
  layout: z.string().min(1, 'El layout es requerido.'),
  duration: z.coerce.number().int().positive('La duración debe ser un número positivo.'),
  animation: z.string().min(1, 'La animación es requerida.'),
  images: z.array(MosaicImageSchema).min(1, 'Debe haber al menos una imagen por mosaico.'),
});

const MosaicTilesSchema = z.array(MosaicTileSchema);

export async function saveMosaicAction(data: MosaicTileData[]) {
    // Before validation, ensure every image has an 'id' field, as the client relies on it.
    const dataWithIds = data.map(tile => ({
        ...tile,
        images: tile.images.map(image => ({
            ...image,
            id: image.id || `new-img-${Date.now()}`
        }))
    }));

    const validationResult = MosaicTilesSchema.safeParse(dataWithIds);

    if (!validationResult.success) {
        console.error("Zod Validation Errors:", validationResult.error.issues);
        return { 
            success: false, 
            message: 'Datos inválidos. Por favor, revise los campos marcados.',
            errors: validationResult.error.issues,
        };
    }

    try {
        await saveMosaicTiles(validationResult.data);
        revalidatePath('/');
        return { success: true, message: '¡Mosaico guardado con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function getImageAsDataUriAction(imagePath: string): Promise<{ success: boolean; dataUri?: string; message?: string; }> {
    if (!imagePath.startsWith('/')) {
        return { success: false, message: 'La ruta debe ser local (empezar con /).' };
    }
    
    try {
        const filePath = path.join(process.cwd(), 'public', imagePath);
        const fileBuffer = await fs.readFile(filePath);
        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
        const dataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        return { success: true, dataUri };
    } catch (error) {
        console.error("Error reading file for data URI:", error);
        return { success: false, message: 'No se pudo leer el archivo de imagen. Asegúrese de que la ruta sea correcta.' };
    }
}
