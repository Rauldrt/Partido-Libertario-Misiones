
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
    if (getApps().length > 0 && adminApp && adminDb) {
        return;
    }
    
    try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey) {
            throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida. Por favor, añádala al archivo .env.local.");
        }

        // Intenta analizar el JSON. Si falla, el bloque catch lo manejará.
        const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKey);

        adminApp = initializeApp({
            credential: cert(serviceAccount),
        }, 'adminApp'); // Damos un nombre único a la app de admin
        
        adminDb = getFirestore(adminApp);
        console.log("Firebase Admin SDK inicializado correctamente.");

    } catch (e: any) {
        console.error("************************************************************");
        console.error("ERROR CRÍTICO: No se pudo inicializar el SDK de Administrador de Firebase.");
        if (e.message.includes('JSON')) {
            console.error("Causa probable: El valor de FIREBASE_SERVICE_ACCOUNT_KEY en el archivo .env.local no es un JSON válido.");
            console.error("Asegúrate de copiar y pegar el contenido COMPLETO del archivo de la cuenta de servicio, incluyendo las llaves de apertura y cierre {}.")
        } else {
            console.error("Detalle del error:", e.message);
        }
        console.error("************************************************************");
        // Dejamos adminDb como undefined para que getAdminDb lo maneje.
    }
}


/**
 * Obtiene la instancia de Firestore del SDK de Administrador.
 * Realiza una inicialización "lazy" en el primer llamado.
 * Lanza un error si la inicialización falla.
 */
export const getAdminDb = async (): Promise<Firestore> => {
  // Siempre intenta inicializar en caso de que aún no se haya hecho o haya fallado antes.
  if (!adminDb) {
    initializeAdminApp();
  }
  
  // Después de intentar inicializar, comprueba de nuevo si adminDb está disponible.
  if (!adminDb) {
    throw new Error("El SDK de Administrador de Firebase no se ha inicializado correctamente. Revisa los logs del servidor para ver el error crítico.");
  }
  
  return adminDb;
};

