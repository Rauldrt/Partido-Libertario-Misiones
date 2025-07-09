
"use client";

import React, { useState, useTransition } from 'react';
import type { SocialWidgetData } from '@/lib/widget-service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { saveSocialWidgetAction } from './actions';
import { EmbedDisplay } from '@/components/EmbedDisplay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function WidgetEditorClient({ initialData }: { initialData: SocialWidgetData }) {
  const [embedCode, setEmbedCode] = useState(initialData.embedCode);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSaveChanges = () => {
    startTransition(async () => {
      const result = await saveSocialWidgetAction({ embedCode });
      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="embedCode" className="text-lg font-semibold">Código de Inserción del Widget</Label>
                <Textarea
                    id="embedCode"
                    value={embedCode}
                    onChange={(e) => setEmbedCode(e.target.value)}
                    placeholder="<div class=... ></div>"
                    className="min-h-[200px] font-mono text-sm"
                    disabled={isPending}
                />
            </div>
             <Alert>
                <AlertTitle>¿Cómo funciona?</AlertTitle>
                <AlertDescription>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Obtené el código de inserción de tu proveedor (ej. Elfsight).</li>
                        <li>Pegá el código completo en el área de texto de arriba.</li>
                        <li>Guardá los cambios. El widget se actualizará en todo el sitio.</li>
                    </ol>
                </AlertDescription>
            </Alert>

            <Button onClick={handleSaveChanges} disabled={isPending} size="lg" className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar Widget
            </Button>
        </div>
        <div className="space-y-2">
             <Label className="text-lg font-semibold">Vista Previa</Label>
             <div className="border rounded-lg p-4 min-h-[300px]">
                {embedCode ? (
                    <EmbedDisplay embedCode={embedCode} />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>No hay código para mostrar.</p>
                    </div>
                )}
             </div>
        </div>
    </div>
  );
}
