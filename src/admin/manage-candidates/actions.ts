
'use server';

import { saveCandidates } from '@/lib/dynamic-sections-service';
import { revalidatePath } from 'next/cache';
import type { TeamMember } from '@/lib/dynamic-sections-service';

export async function saveCandidatesAction(items: TeamMember[]) {
    try {
        const { message } = await saveCandidates(items);
        revalidatePath('/'); // Revalidate home page where candidates are shown
        revalidatePath('/about'); // Also revalidate about if they are shown there
        return { success: true, message };
    } catch (e) {
        const error = e as Error;
        return { success: false, message: error.message };
    }
}
