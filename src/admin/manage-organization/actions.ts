
'use server';

import { saveOrganization } from '@/lib/dynamic-sections-service';
import { revalidatePath } from 'next/cache';
import type { TeamMember } from '@/lib/dynamic-sections-service';

export async function saveOrganizationAction(items: TeamMember[]) {
    try {
        const { message } = await saveOrganization(items);
        revalidatePath('/'); // Revalidate home page where organization is shown
        return { success: true, message };
    } catch (e) {
        const error = e as Error;
        return { success: false, message: error.message };
    }
}
