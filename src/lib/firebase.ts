
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function isFirebaseConfigValid(config: FirebaseOptions): boolean {
    return Object.values(config).every(value => value && typeof value === 'string' && value.length > 0);
}

// Initialize Firebase
let app;
if (getApps().length === 0) {
    if(isFirebaseConfigValid(firebaseConfig)) {
        app = initializeApp(firebaseConfig);
    } else {
        console.error("Firebase config is invalid. Some environment variables are missing from .env.local. Firebase will not be initialized.");
    }
} else {
  app = getApp();
}

let auth: Auth | null = null;
if (app) {
    auth = getAuth(app);
}

// Export a function to get the auth instance, which can be null
export const getFirebaseAuth = (): Auth | null => {
    return auth;
};
