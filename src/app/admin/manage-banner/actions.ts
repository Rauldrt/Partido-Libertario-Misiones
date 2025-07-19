
'use server';

import { z } from 'zod';
import { saveBannerSlides, type BannerSlideData } from '@/lib/homepage-service';
import { revalidatePath } from 'next/cache';

const CtaSchema = z.object({
  text: z.string().min(1, 'El texto del botón es requerido.'),
  link: z.string().min(1, 'El enlace del botón es requerido.'),
  accordionTarget: z.string().optional(),
});

const BannerSlideSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'El título es requerido.'),
  description: z.string().min(1, 'La descripción es requerida.'),
  cta: CtaSchema,
  expiresAt: z.string().optional().or(z.literal('')),
  // Corrected validation: Allow empty string or a valid URL, and make it fully optional.
  imageUrl: z.string().url("Debe ser una URL válida.").or(z.literal('')).optional(),
  videoUrl: z.string().optional().or(z.literal('')),
  embedCode: z.string().optional().or(z.literal('')),
});

const BannerSlidesSchema = z.array(BannerSlideSchema);


export async function saveBannerAction(data: BannerSlideData[]) {
    const validation = BannerSlidesSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        return { success: false, message: 'Datos inválidos. Por favor, revise todos los campos.' };
    }

    try {
        await saveBannerSlides(validation.data);
        revalidatePath('/');
        
        return { success: true, message: '¡Banner guardado con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
