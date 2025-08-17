
'use server';

import { getAdminDb } from '@/lib/firebase-admin';

/**
 * A Server Action to safely check if the Firebase Admin SDK is initialized.
 * This can be called from client components without exposing server-side details.
 */
export async function getAdminSdkStatus(): Promise<{ isActive: boolean }> {
  const db = getAdminDb();
  return { isActive: !!db };
}
