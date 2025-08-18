
'use server';

import { initializeApp, getApps, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

/**
 * Initializes the Firebase Admin SDK if it hasn't been already.
 * This is a "lazy" initialization, meaning it only runs when the DB is first requested.
 */
function initializeAdminApp() {
    if (getApps().length > 0) {
        adminApp = getApps()[0];
        adminDb = getFirestore(adminApp);
        return;
    }
    
    try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey) {
            throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida. Por favor, añádala al archivo .env.local.");
        }

        const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKey);

        adminApp = initializeApp({
            credential: cert(serviceAccount),
        });
        
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
        // Deja adminDb como undefined para que getAdminDb lo maneje.
    }
}


/**
 * Obtiene la instancia de Firestore del SDK de Administrador.
 * Realiza una inicialización "lazy" en el primer llamado.
 * Lanza un error si la inicialización falla.
 */
export const getAdminDb = async (): Promise<Firestore> => {
  // Si adminDb no está definido, intenta inicializar la app.
  if (!adminDb) {
    initializeAdminApp();
  }
  
  // Después de intentar inicializar, comprueba de nuevo.
  if (!adminDb) {
    throw new Error("El SDK de Administrador de Firebase no se ha inicializado correctamente. Revisa los logs del servidor para más detalles.");
  }
  
  return adminDb;
};
