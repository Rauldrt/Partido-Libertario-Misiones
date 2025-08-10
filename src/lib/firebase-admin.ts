
import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App;

// The service account key is now parsed from an environment variable.
// This is more secure and flexible for different environments (local, Vercel, etc.).
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
        console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", e);
    }
} else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set. Firebase Admin SDK will not be initialized.");
}

if (getApps().length === 0 && serviceAccount) {
  app = initializeApp({
    credential: cert(serviceAccount)
  });
} else {
  app = getApp();
}

const dbAdmin: Firestore = getFirestore(app);

export const getAdminDb = (): Firestore => {
  return dbAdmin;
};
