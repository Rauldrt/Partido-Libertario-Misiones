
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

        const appName = 'firebase-admin-app-server'; // Use a unique name
        if (!getApps().some(app => app.name === appName)) {
            adminApp = initializeApp({
                credential: cert(serviceAccount),
                databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
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


export async function getAdminDb(): Promise<Firestore | null> {
  if (initializationError) {
    return null;
  }
  return adminDb || null;
};
