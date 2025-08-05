
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Function to check if all required Firebase config values are present
function isFirebaseConfigValid(config: typeof firebaseConfig): boolean {
    return Object.values(config).every(value => value);
}

// Initialize Firebase
let app;

// We only initialize the app on the server or client if it hasn't been initialized already.
if (!getApps().length) {
    if (isFirebaseConfigValid(firebaseConfig)) {
        app = initializeApp(firebaseConfig);
    } else {
        // This log will appear in the server console during build/server-side rendering,
        // and in the browser console on the client-side.
        console.error("Firebase config is invalid. Some environment variables are missing. Please check your .env.local file.");
    }
} else {
    app = getApp(); // Get the already-initialized app
}

export default app;
