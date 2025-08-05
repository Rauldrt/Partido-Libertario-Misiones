
'use client';

import { useEffect, useState } from 'react';
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Your web app's Firebase configuration pulled directly from environment variables
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

export function FirebaseStatus() {
  const [isClient, setIsClient] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Only attempt to initialize on the client side
    if (typeof window !== 'undefined') {
        if (!getApps().length) {
            if (isFirebaseConfigValid(firebaseConfig)) {
                try {
                    const app = initializeApp(firebaseConfig);
                    const currentProjectId = app.options.projectId;
                    if (currentProjectId) {
                        setProjectId(currentProjectId);
                        setIsConnected(true);
                        console.log(`✅ Firebase Connection Verified: Successfully connected to project "${currentProjectId}".`);
                    } else {
                         setIsConnected(false);
                         console.error('❌ Firebase Connection Failed: Firebase is initialized, but no Project ID was found in the configuration. Please check your .env.local file.');
                    }
                } catch (error) {
                    setIsConnected(false);
                    console.error('❌ Firebase Initialization Error:', error);
                }
            } else {
                setIsConnected(false);
                console.error("❌ Firebase config is invalid. Some environment variables are missing. Please check your .env.local file.");
            }
        } else {
            // App is already initialized
            const app = getApp();
            const currentProjectId = app.options.projectId;
            if (currentProjectId) {
                setProjectId(currentProjectId);
                setIsConnected(true);
            } else {
                 setIsConnected(false);
            }
        }
    }
  }, []);

  if (!isClient) {
    // Render a placeholder on the server and during initial hydration.
    return (
        <Badge variant="secondary" className="text-xs sm:text-sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verificando...
        </Badge>
    );
  }

  return (
    <>
      {isConnected ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Firebase Conectado
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Conectado a: {projectId}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Badge variant="destructive" className="text-xs sm:text-sm">
                        <XCircle className="mr-2 h-4 w-4" />
                        Firebase Desconectado
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Revisá el archivo .env.local y la consola del navegador.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
