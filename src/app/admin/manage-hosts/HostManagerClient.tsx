
"use client";

import React, { useState, useTransition } from 'react';
import type { HostPattern } from '@/lib/config-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Plus, Save, Trash2, TriangleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveAllowedHostsAction } from './actions';

// Add a temporary ID for list rendering
type HostPatternWithId = HostPattern & { id: string };

export function HostManagerClient({ initialHosts }: { initialHosts: HostPattern[] }) {
  const [hosts, setHosts] = useState<HostPatternWithId[]>(
    initialHosts.map((host, index) => ({ ...host, id: `host-${index}-${Date.now()}` }))
  );
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleHostChange = (id: string, newHostname: string) => {
    setHosts(currentHosts =>
      currentHosts.map(host =>
        host.id === id ? { ...host, hostname: newHostname } : host
      )
    );
  };

  const handleAddHost = () => {
    const newHost: HostPatternWithId = {
      id: `new-${Date.now()}`,
      protocol: 'https',
      hostname: '',
      port: '',
      pathname: '/**',
    };
    setHosts(currentHosts => [...currentHosts, newHost]);
  };

  const handleDeleteHost = (id: string) => {
    setHosts(currentHosts => currentHosts.filter(host => host.id !== id));
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
        // Strip the temporary ID before sending to the server
        const dataToSave = hosts.map(({ id, ...rest }) => rest);
        const result = await saveAllowedHostsAction(dataToSave);
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
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Hosts de Imágenes</CardTitle>
        <CardDescription>
          Añade o elimina los dominios desde los cuales se pueden cargar imágenes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive-foreground">
          <TriangleAlert className="h-4 w-4 !text-destructive" />
          <AlertTitle>Paso Manual Requerido</AlertTitle>
          <AlertDescription>
            Para que los cambios en esta página surtan efecto, es **imprescindible reiniciar el servidor de la aplicación manualmente** después de guardar. La aplicación no puede reiniciarse sola.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
            <Label className="text-base font-medium">Hosts Permitidos</Label>
            {hosts.map((host) => (
                <div key={host.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Input
                        value={host.hostname}
                        onChange={(e) => handleHostChange(host.id, e.target.value)}
                        placeholder="ejemplo.com"
                        className="flex-grow"
                        disabled={isPending}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteHost(host.id)}
                        disabled={isPending}
                        aria-label="Eliminar host"
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ))}
             {hosts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No hay hosts configurados.</p>
            )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button onClick={handleAddHost} disabled={isPending} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Host
          </Button>
          <Button onClick={handleSaveChanges} disabled={isPending} size="lg" className="bg-destructive hover:bg-destructive/90">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar y Recordar Reinicio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
