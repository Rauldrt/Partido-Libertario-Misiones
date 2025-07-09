
"use client";

import React, { useState, useTransition } from 'react';
import type { SocialLink } from '@/lib/social-links-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { saveSocialLinksAction } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export function SocialLinksEditorClient({ initialLinks }: { initialLinks: SocialLink[] }) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleLinkChange = (id: string, field: keyof Omit<SocialLink, 'id' | 'label'>, value: string) => {
    setLinks(currentLinks =>
      currentLinks.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const result = await saveSocialLinksAction(links);
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
      <CardContent className="space-y-6 pt-6">
        <Alert>
          <AlertTitle>¿Cómo funciona esto?</AlertTitle>
          <AlertDescription>
            <p>Pegá aquí el código para "insertar" que te da cada red social. Luego, ajustá el ancho y alto en los campos separados. Podés usar valores como `500px` o `100%`.</p>
            <p className="mt-2">Este contenido se mostrará en una ventana modal al hacer clic en los íconos del encabezado o pie de página.</p>
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {links.map((link) => (
            <div key={link.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
              <Label htmlFor={`link-${link.id}`} className="text-lg font-semibold text-primary">{link.label}</Label>
              
              <div className="space-y-2">
                <Label htmlFor={`embedCode-${link.id}`}>Código de Inserción</Label>
                <Textarea
                  id={`embedCode-${link.id}`}
                  value={link.embedCode}
                  onChange={(e) => handleLinkChange(link.id, 'embedCode', e.target.value)}
                  placeholder={`Código de inserción para ${link.label}`}
                  disabled={isPending}
                  className="min-h-[120px] font-mono text-xs bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`width-${link.id}`}>Ancho (ej: 500px, 100%)</Label>
                    <Input
                        id={`width-${link.id}`}
                        value={link.width || ''}
                        onChange={(e) => handleLinkChange(link.id, 'width', e.target.value)}
                        placeholder="Automático"
                        disabled={isPending}
                        className="bg-background"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor={`height-${link.id}`}>Alto (ej: 600px)</Label>
                    <Input
                        id={`height-${link.id}`}
                        value={link.height || ''}
                        onChange={(e) => handleLinkChange(link.id, 'height', e.target.value)}
                        placeholder="Automático"
                        disabled={isPending}
                        className="bg-background"
                    />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center pt-4 border-t">
          <Button onClick={handleSaveChanges} disabled={isPending} size="lg">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Enlaces
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
