
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let isInitialized = false;

function initializeAdminApp() {
    if (isInitialized) {
        return;
    }
    isInitialized = true; // Attempt initialization only once

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        console.warn("Firebase Admin: FIREBASE_SERVICE_ACCOUNT_KEY no está configurada. El SDK de administrador no se inicializará. Se usarán los datos locales como respaldo.");
        return;
    }
    
    // Check if the app is already initialized to prevent errors during hot-reloads
    if (getApps().some(app => app.name === 'firebase-admin-app')) {
        adminApp = getApps().find(app => app.name === 'firebase-admin-app')!;
    } else {
        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            adminApp = initializeApp({
                credential: cert(serviceAccount)
            }, 'firebase-admin-app');
        } catch (e) {
            console.error("Firebase Admin: Error al analizar FIREBASE_SERVICE_ACCOUNT_KEY o al inicializar la app.", e);
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
