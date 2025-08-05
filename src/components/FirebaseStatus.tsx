
'use client';

import { useEffect, useState } from 'react';
import { getApps, getApp } from 'firebase/app';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function FirebaseStatus() {
  const [isClient, setIsClient] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, ensuring window and other browser APIs are available.
    setIsClient(true);
    
    // Check if any Firebase apps are initialized.
    const apps = getApps();
    if (apps.length > 0) {
      try {
        // A more robust check is to try and get the default app and check its config.
        const defaultApp = getApp();
        const projectId = defaultApp.options.projectId;
        if (projectId) {
          setIsConnected(true);
          console.log(`✅ Firebase Connection Verified: Successfully connected to project "${projectId}".`);
        } else {
            setIsConnected(false);
            console.error('❌ Firebase Connection Failed: Firebase is initialized, but no Project ID was found in the configuration. Please check your .env.local file.');
        }
      } catch (error) {
        setIsConnected(false);
        console.error('❌ Firebase Connection Failed: Could not get Firebase app instance.', error);
      }
    } else {
        setIsConnected(false);
        console.error('❌ Firebase Connection Failed: No Firebase app has been initialized. Please check the server console for errors about missing environment variables.');
    }
  }, []);

  if (!isClient) {
    // Render a placeholder or skeleton on the server and during the initial client render.
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
