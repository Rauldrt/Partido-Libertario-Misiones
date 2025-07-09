
'use server';

import { z } from 'zod';
import { saveSocialLinks } from '@/lib/social-links-service';
import { revalidatePath } from 'next/cache';

const SocialLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  embedUrl: z.string().url('Debe ser una URL válida.'),
});

const SocialLinksSchema = z.array(SocialLinkSchema);

export async function saveSocialLinksAction(data: unknown) {
    const validation = SocialLinksSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        return { success: false, message: 'Datos inválidos. Por favor, revise que todas las URLs sean válidas.' };
    }

    try {
        await saveSocialLinks(validation.data);
        revalidatePath('/'); // Revalidate home page in case links are used there
        
        return { success: true, message: '¡Enlaces sociales guardados con éxito!' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
