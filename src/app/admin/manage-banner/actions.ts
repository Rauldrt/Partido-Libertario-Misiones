
'use server';

import { z } from 'zod';
import { saveBannerSlides, getBannerSlides as getSlidesFromDb, type BannerSlideData } from '@/lib/homepage-service';
import { revalidatePath } from 'next/cache';

const CtaSchema = z.object({
  text: z.string(),
  link: z.string(),
  accordionTarget: z.string().optional(),
});

const BannerSlideSchema = z.object({
  id: z.string(),
  title: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  cta: CtaSchema,
  expiresAt: z.string().optional().or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')), // Make it truly optional and allow empty string
  videoUrl: z.string().optional().or(z.literal('')),
  embedCode: z.string().optional().or(z.literal('')),
});

const BannerSlidesSchema = z.array(BannerSlideSchema);


export async function saveBannerAction(data: BannerSlideData[]) {
    // Fill in default values for empty CTA fields before validation
    const dataWithDefaults = data.map(slide => ({
        ...slide,
        cta: {
            text: slide.cta.text || 'Saber Más',
            link: slide.cta.link || '#',
            accordionTarget: slide.cta.accordionTarget || ''
        }
    }));
    
    const validation = BannerSlidesSchema.safeParse(dataWithDefaults);

    if (!validation.success) {
        console.error("Validation failed:", validation.error.issues);
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

export async function getBannerSlidesAction() {
    try {
        const slides = await getSlidesFromDb();
        return { success: true, data: slides };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
