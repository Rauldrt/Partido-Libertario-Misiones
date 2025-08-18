
'use server';

import { initializeApp, getApps, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;
let initializationError: Error | null = null;
let isInitialized = false;

function initializeAdminApp() {
    if (isInitialized) {
        return;
    }
    isInitialized = true;

    try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey) {
            throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida. El SDK de Administrador no puede autenticarse.");
        }

        const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKey);

        const appName = 'firebase-admin-app';
        if (!getApps().some(app => app.name === appName)) {
            adminApp = initializeApp({
                credential: cert(serviceAccount),
                databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
            }, appName);
            console.log("Firebase Admin SDK inicializado correctamente.");
        } else {
            adminApp = getApps().find(app => app.name === appName);
        }

        if (adminApp) {
            adminDb = getFirestore(adminApp);
        } else {
             throw new Error("La aplicación de administrador de Firebase no se pudo inicializar.");
        }

    } catch (e) {
        initializationError = e as Error;
        console.error("************************************************************");
        console.error("ERROR CRÍTICO: No se pudo inicializar el SDK de Administrador de Firebase.");
        console.error(initializationError.message);
        console.error("Asegúrese de que FIREBASE_SERVICE_ACCOUNT_KEY esté correctamente configurada en las variables de entorno del servidor.");
        console.error("************************************************************");
        adminApp = undefined;
        adminDb = undefined;
    }
}

// Initialize on module load
initializeAdminApp();

/**
 * Obtiene la instancia de Firestore Admin.
 * Lanza un error si la inicialización ha fallado previamente.
 * @returns La instancia de Firestore o null si no se pudo inicializar.
 */
export const getAdminDb = async (): Promise<Firestore | null> => {
  if (initializationError) {
    // Si ya hubo un error en la inicialización, no intentes devolver la bd.
    // Los servicios que llaman a esta función deben estar preparados para manejar null.
    return null;
  }
  return adminDb || null;
};
