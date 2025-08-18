
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let isInitialized = false;

function initializeAdminApp() {
    if (isInitialized) {
        return;
    }
    isInitialized = true;

    // Check if the app is already initialized to prevent errors during hot-reloads
    if (getApps().some(app => app.name === 'firebase-admin-app')) {
        adminApp = getApps().find(app => app.name === 'firebase-admin-app')!;
    } else {
        try {
            // When running in a Google Cloud environment, the SDK can auto-discover credentials.
            // For local development, you would set the GOOGLE_APPLICATION_CREDENTIALS env var.
            // This approach is more robust than parsing a key from an environment variable.
            adminApp = initializeApp(undefined, 'firebase-admin-app');
        } catch (e) {
            console.error("Firebase Admin: Error al inicializar la app.", e);
            return;
        }
    }
    
    if (adminApp) {
        adminDb = getFirestore(adminApp);
        console.log("Firebase Admin SDK inicializado correctamente.");
    }
}

// Initialize on module load
initializeAdminApp();

export const getAdminDb = (): Firestore | null => {
  return adminDb;
};
