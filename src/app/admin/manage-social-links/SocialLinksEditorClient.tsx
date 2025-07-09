
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

export function SocialLinksEditorClient({ initialLinks }: { initialLinks: SocialLink[] }) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleLinkChange = (id: string, value: string) => {
    setLinks(currentLinks =>
      currentLinks.map(link =>
        link.id === id ? { ...link, embedCode: value } : link
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
            <p>Para cada red social, puedes pegar el **código de inserción completo** (embed) o **solo la URL** que se debe mostrar en el iframe.</p>
            <p className="mt-2">Si pegás solo una URL (ej. `https://www.youtube.com/embed/...`), el sistema creará un `&lt;iframe&gt;` responsivo por vos.</p>
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {links.map((link) => (
            <div key={link.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
              <Label htmlFor={`embedCode-${link.id}`} className="text-lg font-semibold text-primary">{link.label}</Label>
              
              <div className="space-y-2">
                <Textarea
                  id={`embedCode-${link.id}`}
                  value={link.embedCode}
                  onChange={(e) => handleLinkChange(link.id, e.target.value)}
                  placeholder={`Pegá aquí el código de inserción o la URL para ${link.label}`}
                  disabled={isPending}
                  className="min-h-[150px] font-mono text-xs bg-background"
                />
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
