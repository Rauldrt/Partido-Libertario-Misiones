
"use client";

import React, { useState, useTransition } from 'react';
import type { PageHeadersData } from '@/lib/page-headers-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { savePageHeadersAction } from './actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const PAGE_NAMES: { [key: string]: string } = {
    news: 'Noticias y Eventos',
    about: 'Quiénes Somos',
    referentes: 'Nuestros Referentes',
    contact: 'Contacto',
    afiliacion: 'Página de Afiliación',
    fiscalizacion: 'Página de Fiscalización',
};

export function PageHeadersEditorClient({ initialData }: { initialData: PageHeadersData }) {
  const [data, setData] = useState<PageHeadersData>(initialData);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleInputChange = (page: string, field: 'title' | 'description' | 'icon' | 'backgroundImage' | 'featuredImage', value: string) => {
    setData(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value
      }
    }));
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const result = await savePageHeadersAction(data);
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
      <Accordion type="single" collapsible className="w-full" defaultValue={Object.keys(data)[0]}>
        {Object.entries(data).map(([pageKey, pageData]) => (
          <AccordionItem key={pageKey} value={pageKey}>
            <AccordionTrigger>
              <span className="text-lg font-medium">{PAGE_NAMES[pageKey] || pageKey}</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="pt-4 grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${pageKey}`}>Título</Label>
                    <Input
                      id={`title-${pageKey}`}
                      value={pageData.title}
                      onChange={(e) => handleInputChange(pageKey, 'title', e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${pageKey}`}>Descripción</Label>
                    <Textarea
                      id={`description-${pageKey}`}
                      value={pageData.description}
                      onChange={(e) => handleInputChange(pageKey, 'description', e.target.value)}
                      disabled={isPending}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`icon-${pageKey}`}>Icono (de Lucide-React)</Label>
                    <Input
                      id={`icon-${pageKey}`}
                      value={pageData.icon}
                      onChange={(e) => handleInputChange(pageKey, 'icon', e.target.value)}
                      disabled={isPending}
                      placeholder="Ej: Newspaper, Users, Star"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`backgroundImage-${pageKey}`}>URL de Imagen de Fondo (Opcional)</Label>
                    <Input
                    id={`backgroundImage-${pageKey}`}
                    value={pageData.backgroundImage || ''}
                    onChange={(e) => handleInputChange(pageKey, 'backgroundImage', e.target.value)}
                    disabled={isPending}
                    placeholder="Ej: /background.jpg o https://..."
                    />
                    <p className="text-xs text-muted-foreground">Ruta local (ej. /fondo.jpg) o URL completa.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`featuredImage-${pageKey}`}>URL de Imagen Destacada (Opcional)</Label>
                    <Input
                    id={`featuredImage-${pageKey}`}
                    value={pageData.featuredImage || ''}
                    onChange={(e) => handleInputChange(pageKey, 'featuredImage', e.target.value)}
                    disabled={isPending}
                    placeholder="Ej: /divider.webp o https://..."
                    />
                     <p className="text-xs text-muted-foreground">Ruta local (ej. /destacada.jpg) o URL completa.</p>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSaveChanges} disabled={isPending} size="lg">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Todos los Cambios
        </Button>
      </div>
    </div>
  );
}
