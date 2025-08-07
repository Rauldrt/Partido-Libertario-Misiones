
'use server';

import { z } from 'zod';
import { saveMosaicTiles, type MosaicTileData } from '@/lib/homepage-service';
import { revalidatePath } from 'next/cache';

const MosaicImageSchema = z.object({
  id: z.string(),
  src: z.string().min(10, 'La URL de la imagen debe ser válida y tener al menos 10 caracteres.').refine(value => value.startsWith('https://') || value.startsWith('/'), { message: 'La URL debe ser segura (https) o una ruta local.'}),
  alt: z.string().min(1, 'El texto alternativo es requerido.'),
  hint: z.string(),
  caption: z.string().min(1, 'La leyenda es requerida.'),
});

const MosaicTileSchema = z.object({
  id: z.string(),
  layout: z.string().min(1, 'El layout es requerido.'),
  duration: z.number().int().positive('La duración debe ser un número positivo.'),
  animation: z.string().min(1, 'La animación es requerida.'),
  images: z.array(MosaicImageSchema).min(1, 'Debe haber al menos una imagen por mosaico.'),
});

const MosaicTilesSchema = z.array(MosaicTileSchema);

export async function saveMosaicAction(data: MosaicTileData[]) {
    const validation = MosaicTilesSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        return { 
            success: false, 
            message: 'Datos inválidos. Por favor, revise todos los campos.',
            errors: validation.error.issues,
        };
    }

    try {
        await saveMosaicTiles(validation.data);
        revalidatePath('/');
        return { success: true, message: '¡Mosaico guardado con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
