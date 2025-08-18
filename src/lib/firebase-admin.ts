
'use server';

import { initializeApp, getApps, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
        throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida.");
    }

    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKey);

    const appName = 'firebase-admin-app-server';
    
    if (!getApps().some(app => app.name === appName)) {
        adminApp = initializeApp({
            credential: cert(serviceAccount),
            databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
        }, appName);
    } else {
        adminApp = getApps().find(app => app.name === appName)!;
    }
    
    adminDb = getFirestore(adminApp);
    console.log("Firebase Admin SDK inicializado correctamente.");

} catch (e) {
    console.error("************************************************************");
    console.error("ERROR CRÍTICO: No se pudo inicializar el SDK de Administrador de Firebase.");
    console.error((e as Error).message);
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
