
'use client';

import { useEffect, useState } from 'react';
import { getApps } from 'firebase/app';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function FirebaseStatus() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This runs only on the client
    setIsClient(true);
    
    const isConnected = getApps().length > 0;
    if (isConnected && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.log(`✅ Firebase Connection Verified: Successfully connected to project "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}".`);
    } else {
      console.error('❌ Firebase Connection Failed: Could not initialize Firebase. Please check your .env.local file and ensure all firebaseConfig variables are set correctly.');
    }
  }, []);

  if (!isClient) {
    // Render a placeholder or skeleton on the server and during initial client render
    return (
        <Badge variant="secondary" className="text-xs sm:text-sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verificando...
        </Badge>
    );
  }

  const isConnected = getApps().length > 0 && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  return (
    <>
      {isConnected ? (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
          <CheckCircle className="mr-2 h-4 w-4" />
          Firebase Conectado
        </Badge>
      ) : (
        <Badge variant="destructive" className="text-xs sm:text-sm">
          <XCircle className="mr-2 h-4 w-4" />
          Firebase Desconectado
        </Badge>
      )}
    </>
  );
}
