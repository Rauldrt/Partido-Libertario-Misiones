
"use client";

import React, { useState, useTransition } from 'react';
import type { SocialLink } from '@/lib/social-links-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { saveSocialLinksAction } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SocialLinksEditorClient({ initialLinks }: { initialLinks: SocialLink[] }) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleLinkChange = (id: string, newUrl: string) => {
    setLinks(currentLinks =>
      currentLinks.map(link =>
        link.id === id ? { ...link, embedUrl: newUrl } : link
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
            <p>Estas URLs se utilizan cuando un usuario hace clic en un ícono de red social en el encabezado o pie de página. Se abrirá una ventana emergente (modal) con el contenido de esta URL.</p>
            <p className="mt-2">Idealmente, deberías usar una URL de "embed" o "inserción" si la red social la proporciona, ya que a menudo ofrecen una vista más limpia y adaptada.</p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className="space-y-2">
              <Label htmlFor={`link-${link.id}`} className="text-base font-medium">{link.label}</Label>
              <Input
                id={`link-${link.id}`}
                value={link.embedUrl}
                onChange={(e) => handleLinkChange(link.id, e.target.value)}
                placeholder={`URL para ${link.label}`}
                disabled={isPending}
              />
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
