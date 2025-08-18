
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
    // Si ya tenemos una app inicializada, no hacemos nada.
    if (getApps().some(app => app.name === 'adminApp')) {
        if (!adminApp) {
            adminApp = getApps().find(app => app.name === 'adminApp');
            adminDb = getFirestore(adminApp);
        }
        return;
    }
    
    try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey || serviceAccountKey.includes('PEGA_AQUI_TU_LLAVE')) {
            throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida en el archivo .env.local. Por favor, añada la llave de servicio y reinicie el servidor.");
        }
        
        // Limpiar la llave de posibles problemas de formato
        const cleanedServiceAccountKey = serviceAccountKey.trim();

        const serviceAccount: ServiceAccount = JSON.parse(cleanedServiceAccountKey);

        adminApp = initializeApp({
            credential: cert(serviceAccount),
        }, 'adminApp');
        
        adminDb = getFirestore(adminApp);
        console.log("✅ Firebase Admin SDK inicializado correctamente.");

    } catch (e: any) {
        console.error("************************************************************");
        console.error("❌ ERROR CRÍTICO: No se pudo inicializar el SDK de Administrador de Firebase.");
        if (e.message.includes('JSON')) {
            console.error("Causa probable: El valor de FIREBASE_SERVICE_ACCOUNT_KEY en el archivo .env.local no es un JSON válido.");
            console.error("Asegúrate de copiar y pegar el contenido COMPLETO del archivo de la cuenta de servicio, incluyendo las llaves de apertura y cierre {}.")
        } else {
            console.error("Detalle del error:", e.message);
        }
        console.error("************************************************************");
    }
}

/**
 * Obtiene la instancia de Firestore del SDK de Administrador.
 * Realiza una inicialización "lazy" en el primer llamado.
 * Lanza un error si la inicialización falla.
 */
export const getAdminDb = async (): Promise<Firestore> => {
  if (!adminDb) {
    initializeAdminApp();
  }
  
  if (!adminDb) {
    throw new Error("El SDK de Administrador de Firebase no se ha inicializado correctamente. Revisa los logs del servidor para ver el error crítico.");
  }
  
  return adminDb;
};
