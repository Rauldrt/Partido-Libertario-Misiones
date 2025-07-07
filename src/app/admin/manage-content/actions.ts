
'use server';

import { deleteNewsItem, reorderNewsItems, updateNewsItem } from '@/lib/news-service';
import { revalidatePath } from 'next/cache';

export async function togglePublishStatusAction(id: string, currentState: boolean) {
  try {
    await updateNewsItem(id, { published: !currentState });
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin/manage-content');
    return { success: true, message: `El estado del artículo ha sido cambiado.` };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteNewsItemAction(id: string) {
  try {
    const result = await deleteNewsItem(id);
    if (!result.success) {
      throw new Error('El artículo no fue encontrado para eliminarlo.');
    }
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin/manage-content');
    return { success: true, message: 'El artículo ha sido eliminado.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function reorderNewsItemsAction(orderedIds: string[]) {
  try {
    await reorderNewsItems(orderedIds);
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin/manage-content');
    return { success: true, message: 'El contenido ha sido reordenado.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
