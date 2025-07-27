
"use client";

import { getSocialWidgetData } from '@/lib/widget-service';
import { EmbedDisplay } from './EmbedDisplay';
import { useEffect, useState } from 'react';

export function SocialWidget() {
  const [embedCode, setEmbedCode] = useState<string | null>(null);

  useEffect(() => {
    getSocialWidgetData().then(data => setEmbedCode(data.embedCode));
  }, []);

  if (embedCode === null) {
    // Show a placeholder or skeleton while loading
    return (
       <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50 h-full min-h-[300px]">
          <p className="text-center text-muted-foreground">Cargando widget...</p>
       </div>
    );
  }
  
  if (!embedCode) {
    return (
        <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50 h-full min-h-[300px]">
            <p className="text-center text-muted-foreground">
                No hay ningún widget social configurado.
                <br />
                Por favor, añada un código de inserción en el panel de administración.
            </p>
        </div>
    );
  }

  // The EmbedDisplay component handles rendering the HTML and executing any scripts safely.
  return <EmbedDisplay embedCode={embedCode} />;
}
