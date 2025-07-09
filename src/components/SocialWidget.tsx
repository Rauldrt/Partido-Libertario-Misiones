
"use server";

import { getSocialWidgetData } from '@/lib/widget-service';
import { EmbedDisplay } from './EmbedDisplay';

export async function SocialWidget() {
  const { embedCode } = await getSocialWidgetData();
  
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
