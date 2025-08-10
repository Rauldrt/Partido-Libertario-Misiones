

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

function initializeAdminApp() {
    if (getApps().some(app => app.name === 'firebase-admin-app')) {
        adminApp = getApps().find(app => app.name === 'firebase-admin-app')!;
    } else {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountKey) {
            console.error("Firebase Admin: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Admin SDK cannot be initialized.");
            return;
        }

        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            adminApp = initializeApp({
                credential: cert(serviceAccount)
            }, 'firebase-admin-app');
        } catch (e) {
            console.error("Firebase Admin: Error parsing FIREBASE_SERVICE_ACCOUNT_KEY or initializing app.", e);
            return;
        }
    }
    
    if (adminApp) {
        adminDb = getFirestore(adminApp);
    }
}

// Initialize on module load
initializeAdminApp();

export const getAdminDb = (): Firestore => {
  if (!adminDb) {
    // This might happen if the initial initialization failed.
    // We can try one more time.
    initializeAdminApp();
    if (!adminDb) {
      throw new Error("Firebase Admin SDK is not initialized. Check server logs for configuration errors.");
    }
  }
  return adminDb;
};
