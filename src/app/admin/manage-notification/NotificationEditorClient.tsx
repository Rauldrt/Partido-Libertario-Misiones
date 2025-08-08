
"use client";

import React, { useState, useTransition } from 'react';
import type { NotificationData } from '@/lib/notification-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveNotificationDataAction } from './actions';
import { Loader2, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export function NotificationEditorClient({ initialData }: { initialData: NotificationData }) {
  const [data, setData] = useState<NotificationData>(initialData);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleInputChange = (field: keyof NotificationData, value: string | boolean) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const result = await saveNotificationDataAction(data);
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
    <div className="space-y-6">
      <Alert>
          <AlertTitle>¿Cómo funciona?</AlertTitle>
          <AlertDescription>
            <p>Esta burbuja de notificación aparecerá en la esquina superior derecha del banner en la página de inicio. Usala para anuncios importantes.</p>
            <p className="mt-2">Si está desactivada o el texto está vacío, no se mostrará nada.</p>
          </AlertDescription>
        </Alert>

      <Card>
        <CardContent className="pt-6 space-y-6">
           <div className="flex items-center space-x-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Habilitar Notificación
                </p>
                <p className="text-sm text-muted-foreground">
                  Activa o desactiva la burbuja de notificación en el sitio.
                </p>
              </div>
              <Switch
                checked={data.enabled}
                onCheckedChange={(checked) => handleInputChange('enabled', checked)}
                aria-label="Habilitar notificación"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="text">Texto de la Notificación</Label>
                <Input 
                id="text" 
                value={data.text} 
                onChange={(e) => handleInputChange('text', e.target.value)} 
                disabled={isPending || !data.enabled}
                placeholder="Ej: ¡Nuevo evento! Un Clic a la Libertad"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="link">Enlace de la Notificación</Label>
                <Input 
                id="link" 
                value={data.link} 
                onChange={(e) => handleInputChange('link', e.target.value)} 
                disabled={isPending || !data.enabled}
                placeholder="Ej: /news/12345"
                />
                <p className="text-xs text-muted-foreground">Debe ser un enlace relativo (ej. /news/algun-id) o una URL completa.</p>
            </div>
        </CardContent>
      </Card>
      
       <div className="flex justify-between items-center">
            {data.enabled && data.text && (
                 <div className="flex flex-col">
                    <Label className="mb-2 text-sm">Vista Previa</Label>
                    <Link href={data.link || '#'} target="_blank" className="relative">
                        <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary animate-ping"></div>
                        <div className="relative inline-flex items-center rounded-lg bg-background p-2 pr-3 shadow-md border animate-pulse-bubble">
                            <span className="relative flex h-3 w-3 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-sm font-medium text-foreground">{data.text}</span>
                        </div>
                    </Link>
                </div>
            )}
            <div className="flex-grow"></div>
            <Button onClick={handleSaveChanges} disabled={isPending} size="lg">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
            </Button>
      </div>

    </div>
  );
}
