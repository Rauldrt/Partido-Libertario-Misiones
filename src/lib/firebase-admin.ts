
'use server';

import { initializeApp, getApps, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
        throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida. Por favor, añádala al archivo .env.local.");
    }

    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKey);

    const appName = 'firebase-admin-app-server';
    
    if (!getApps().length) {
        adminApp = initializeApp({
            credential: cert(serviceAccount),
        }, appName);
    } else {
        adminApp = getApps()[0];
    }
    
    adminDb = getFirestore(adminApp);
    console.log("Firebase Admin SDK inicializado correctamente.");

} catch (e: any) {
    console.error("************************************************************");
    console.error("ERROR CRÍTICO: No se pudo inicializar el SDK de Administrador de Firebase.");
    if (e.message.includes('JSON')) {
        console.error("El valor de FIREBASE_SERVICE_ACCOUNT_KEY en .env.local no parece ser un JSON válido.");
    } else {
        console.error(e.message);
    }
    console.error("Asegúrese de que FIREBASE_SERVICE_ACCOUNT_KEY esté correctamente configurada en el archivo .env.local.");
    console.error("************************************************************");
}

/**
 * Obtiene la instancia de Firestore del SDK de Administrador.
 * Si la inicialización falló, esta función devolverá `undefined`.
 */
export const getAdminDb = async (): Promise<Firestore | undefined> => {
  return adminDb;
};
