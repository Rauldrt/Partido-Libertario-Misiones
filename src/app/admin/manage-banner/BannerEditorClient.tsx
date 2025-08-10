
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import type { BannerSlideData } from '@/lib/homepage-service';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { GripVertical, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveBannerAction, getBannerSlidesAction } from './actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const SortableSlideItem = ({ slide, setSlides, isPending }: { slide: BannerSlideData, setSlides: React.Dispatch<React.SetStateAction<BannerSlideData[]>>, isPending: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleInputChange = (field: keyof BannerSlideData | `cta.${keyof BannerSlideData['cta']}`, value: string) => {
    setSlides(prev => prev.map(s => {
      if (s.id === slide.id) {
        if (field.startsWith('cta.')) {
            const ctaField = field.split('.')[1] as keyof BannerSlideData['cta'];
            return { ...s, cta: { ...s.cta, [ctaField]: value } };
        }
        return { ...s, [field]: value };
      }
      return s;
    }));
  };
  
  const handleDelete = () => {
    setSlides(prev => prev.filter(s => s.id !== slide.id));
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
        <AccordionItem value={slide.id} className="border-b-0 mb-4 bg-muted/30 rounded-lg overflow-hidden">
            <div className="flex items-center p-2 border-b">
                 <Button variant="ghost" size="icon" {...listeners} className="cursor-grab p-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </Button>
                <AccordionTrigger className="flex-1 p-2 hover:no-underline">
                    <span className="font-semibold text-left truncate">{slide.title || 'Nueva Diapositiva'}</span>
                </AccordionTrigger>
                <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isPending} className="ml-2">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            <AccordionContent>
                <CardContent className="p-4 pt-4 grid gap-4">
                     <div className="space-y-2">
                        <Label htmlFor={`title-${slide.id}`}>Título</Label>
                        <Input id={`title-${slide.id}`} value={slide.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`description-${slide.id}`}>Descripción</Label>
                        <Textarea id={`description-${slide.id}`} value={slide.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                    </div>
                     <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="media" className="border-t">
                            <AccordionTrigger>Contenido Incrustado (Opcional)</AccordionTrigger>
                            <AccordionContent className="grid gap-4 pt-4">
                                <Alert>
                                    <AlertTitle>Modo de Funcionamiento</AlertTitle>
                                    <AlertDescription>
                                        <p>Si rellenas el **Código de Inserción**, este tendrá prioridad y se mostrará en lugar del título y la descripción.</p>
                                        <p className="mt-2">Es ideal para incrustar videos de YouTube, publicaciones de redes sociales, etc.</p>
                                    </AlertDescription>
                                </Alert>
                                 <div className="space-y-2">
                                    <Label htmlFor={`embedCode-${slide.id}`}>Código de Inserción (Opcional)</Label>
                                    <Textarea id={`embedCode-${slide.id}`} value={slide.embedCode || ''} onChange={(e) => handleInputChange('embedCode', e.target.value)} placeholder="<iframe src='...'></iframe>" className="font-mono text-xs" />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="cta">
                            <AccordionTrigger>Acción (CTA) y Expiración</AccordionTrigger>
                            <AccordionContent className="grid gap-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`cta-text-${slide.id}`}>Texto del Botón</Label>
                                    <Input id={`cta-text-${slide.id}`} value={slide.cta.text} onChange={(e) => handleInputChange('cta.text', e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`cta-link-${slide.id}`}>Enlace del Botón</Label>
                                    <Input id={`cta-link-${slide.id}`} value={slide.cta.link} onChange={(e) => handleInputChange('cta.link', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`cta-target-${slide.id}`}>ID del Acordeón (Opcional)</Label>
                                    <Input id={`cta-target-${slide.id}`} value={slide.cta.accordionTarget || ''} onChange={(e) => handleInputChange('cta.accordionTarget', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`expiresAt-${slide.id}`}>Fecha de Expiración (Opcional)</Label>
                                    <Input id={`expiresAt-${slide.id}`} type="date" value={slide.expiresAt || ''} onChange={(e) => handleInputChange('expiresAt', e.target.value)} />
                                    <p className="text-xs text-muted-foreground">La diapositiva se ocultará después de esta fecha. Dejar en blanco para que nunca expire.</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </AccordionContent>
        </AccordionItem>
    </div>
  );
};


export function BannerEditorClient() {
  const [slides, setSlides] = useState<BannerSlideData[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    getBannerSlidesAction().then(result => {
        if(result.success && result.data) {
            setSlides(result.data);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error al cargar',
                description: result.message || 'No se pudieron cargar los slides del banner.'
            });
            setSlides([]); // Set to empty array on error to stop loading
        }
    });
  }, [toast]);

  if (slides === null) {
      return (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        setSlides((items) => {
            if (!items) return [];
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };

  const handleAddNewSlide = () => {
    const newSlide: BannerSlideData = {
        id: `new-${Date.now()}`,
        title: 'Nueva Diapositiva',
        description: 'Descripción de la nueva diapositiva.',
        cta: {
            text: 'Saber Más',
            link: '#',
            accordionTarget: ''
        },
        expiresAt: '',
        imageUrl: '',
        videoUrl: '',
        embedCode: '',
    };
    setSlides(prev => [...(prev || []), newSlide]);
  };

  const handleSaveChanges = () => {
    if (!slides) return;
    startTransition(async () => {
      const result = await saveBannerAction(slides);
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
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <Accordion type="multiple" className="w-full space-y-0">
                {slides.map(slide => (
                    <SortableSlideItem key={slide.id} slide={slide} setSlides={setSlides} isPending={isPending} />
                ))}
              </Accordion>
            </SortableContext>
        </DndContext>
        
        <div className="flex justify-between items-center">
            <Button onClick={handleAddNewSlide} disabled={isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Diapositiva
            </Button>
            <Button onClick={handleSaveChanges} disabled={isPending || !slides} size="lg">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar Cambios
            </Button>
        </div>
    </div>
  );
}
