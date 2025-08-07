
"use client";

import React, { useState, useTransition } from 'react';
import type { MosaicTileData, MosaicImageData } from '@/lib/homepage-service';
import { DndContext, closestCenter, type DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Loader2, Plus, Save, Trash2, ChevronDown, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveMosaicAction } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ZodIssue } from 'zod';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { analyzeImage } from '@/ai/flows/analyze-image-flow';


type ErrorMap = { [fieldPath: string]: string | undefined };

const SortableImageItem = ({ image, tileId, imageIndex, setTiles, isPending, errors }: { image: MosaicImageData, tileId: string, imageIndex: number, setTiles: React.Dispatch<React.SetStateAction<MosaicTileData[]>>, isPending: boolean, errors: ErrorMap }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id, data: { tileId } });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const [isAnalyzing, startAnalyzing] = useTransition();
    const { toast } = useToast();

    const handleImageChange = (field: keyof MosaicImageData, value: string) => {
        setTiles(prev => prev.map(tile => {
            if (tile.id === tileId) {
                return {
                    ...tile,
                    images: tile.images.map(img => img.id === image.id ? { ...img, [field]: value } : img)
                };
            }
            return tile;
        }));
    };

    const handleImageDelete = () => {
        setTiles(prev => prev.map(tile => {
            if (tile.id === tileId) {
                return { ...tile, images: tile.images.filter(img => img.id !== image.id) };
            }
            return tile;
        }));
    };
    
    const handleAnalyzeImage = () => {
        if (!image.src) {
            toast({ variant: 'destructive', title: 'URL Requerida', description: 'Por favor, ingrese una URL de imagen para analizar.' });
            return;
        }

        startAnalyzing(async () => {
            try {
                const result = await analyzeImage({ imageUrl: image.src });
                setTiles(prev => prev.map(tile => {
                    if (tile.id === tileId) {
                        return {
                            ...tile,
                            images: tile.images.map(img => img.id === image.id ? { ...img, caption: result.caption, alt: result.altText } : img)
                        };
                    }
                    return tile;
                }));
                toast({ title: '¡Análisis Completo!', description: 'La IA ha rellenado la leyenda y el texto alternativo.' });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error de Análisis', description: (error as Error).message });
            }
        });
    };

    const findError = (field: keyof MosaicImageData) => {
        return errors[`${tileId}.images[${imageIndex}].${field}`];
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="w-full">
            <Card className="p-3 bg-background relative">
                <Button variant="ghost" size="icon" {...listeners} className="cursor-grab absolute top-1 left-1 h-6 w-6"><GripVertical /></Button>
                 <Button variant="destructive" size="icon" onClick={handleImageDelete} disabled={isPending} className="absolute top-1 right-1 h-6 w-6"><Trash2 className="h-4 w-4"/></Button>
                <div className="grid gap-2 mt-8">
                     <div className="space-y-1">
                        <Label htmlFor={`img-src-${image.id}`}>URL Imagen</Label>
                        <div className="flex items-center gap-2">
                            <Input id={`img-src-${image.id}`} value={image.src} onChange={e => handleImageChange('src', e.target.value)} className={cn(findError('src') && 'border-destructive')} />
                            <Button size="icon" variant="outline" onClick={handleAnalyzeImage} disabled={isAnalyzing || isPending} title="Analizar imagen con IA para rellenar campos">
                                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            </Button>
                        </div>
                        {findError('src') && <p className="text-xs text-destructive">{findError('src')}</p>}
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor={`img-caption-${image.id}`}>Leyenda</Label>
                        <Input id={`img-caption-${image.id}`} value={image.caption} onChange={e => handleImageChange('caption', e.target.value)} className={cn(findError('caption') && 'border-destructive')} />
                         {findError('caption') && <p className="text-xs text-destructive">{findError('caption')}</p>}
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor={`img-alt-${image.id}`}>Texto Alt</Label>
                        <Input id={`img-alt-${image.id}`} value={image.alt} onChange={e => handleImageChange('alt', e.target.value)} className={cn(findError('alt') && 'border-destructive')} />
                         {findError('alt') && <p className="text-xs text-destructive">{findError('alt')}</p>}
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor={`img-hint-${image.id}`}>Hint IA</Label>
                        <Input id={`img-hint-${image.id}`} value={image.hint} onChange={e => handleImageChange('hint', e.target.value)} />
                    </div>
                </div>
            </Card>
        </div>
    );
};

const SortableTileItem = ({ tile, setTiles, isPending, errors }: { tile: MosaicTileData, setTiles: React.Dispatch<React.SetStateAction<MosaicTileData[]>>, isPending: boolean, errors: ErrorMap }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tile.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const handleTileChange = (field: keyof MosaicTileData, value: string | number) => {
    setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, [field]: value } : t));
  };

  const handleTileDelete = () => setTiles(prev => prev.filter(t => t.id !== tile.id));

  const handleAddImage = () => {
    const newImage: MosaicImageData = { id: `new-img-${Date.now()}`, src: 'https://placehold.co/600x400.png', alt: 'Nueva Imagen', hint: 'placeholder', caption: 'Nueva Leyenda' };
    setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, images: [...t.images, newImage] } : t));
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
        <AccordionItem value={tile.id} className="border-b-0 mb-4 bg-muted/30 rounded-lg overflow-hidden">
            <div className="flex items-center p-2 border-b">
                 <Button variant="ghost" size="icon" {...listeners} className="cursor-grab p-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </Button>
                <AccordionTrigger className="flex-1 p-2 hover:no-underline">
                    <span className="font-semibold text-left">Mosaico (Layout: {tile.layout})</span>
                </AccordionTrigger>
                <Button variant="destructive" size="icon" onClick={handleTileDelete} disabled={isPending} className="ml-2">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            <AccordionContent>
                <div className="p-4 pt-4 grid gap-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Layout (CSS Grid)</Label>
                            <Input value={tile.layout} onChange={e => handleTileChange('layout', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Duración (ms)</Label>
                            <Input type="number" value={tile.duration} onChange={e => handleTileChange('duration', parseInt(e.target.value) || 0)} />
                        </div>
                         <div className="space-y-2">
                            <Label>Animación</Label>
                             <Select onValueChange={value => handleTileChange('animation', value)} defaultValue={tile.animation}>
                                 <SelectTrigger><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                     <SelectItem value="animate-fade-in-up">Fade In Up</SelectItem>
                                     <SelectItem value="animate-zoom-in-gentle">Zoom In</SelectItem>
                                     <SelectItem value="animate-crossfade-in">Crossfade</SelectItem>
                                     <SelectItem value="animate-ken-burns-in">Ken Burns</SelectItem>
                                 </SelectContent>
                             </Select>
                        </div>
                    </div>
                    <div>
                         <Label className="text-lg font-medium mb-2 block">Imágenes del Mosaico</Label>
                         <SortableContext items={tile.images.map(img => img.id)} strategy={verticalListSortingStrategy}>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tile.images.map((image, index) => <SortableImageItem key={image.id} image={image} tileId={tile.id} imageIndex={index} setTiles={setTiles} isPending={isPending} errors={errors} />)}
                            </div>
                        </SortableContext>
                        <Button onClick={handleAddImage} className="mt-4"><Plus className="mr-2 h-4 w-4" />Añadir Imagen</Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    </div>
  );
};

export function MosaicEditorClient({ initialTiles }: { initialTiles: MosaicTileData[] }) {
  const [tiles, setTiles] = useState<MosaicTileData[]>(initialTiles);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [errors, setErrors] = useState<ErrorMap>({});


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        // Dragging a tile
        if (tiles.find(t => t.id === active.id)) {
            setTiles(items => arrayMove(items, items.findIndex(i => i.id === active.id), items.findIndex(i => i.id === over.id)));
        }
        // Dragging an image
        else {
             setTiles((currentTiles) => {
                const activeTileId = active.data.current?.tileId;
                const overTileId = over.data.current?.tileId;
                const activeImageId = active.id;
                const overImageId = over.id;

                if (!activeTileId || !overTileId) return currentTiles;
                
                // Dropping over a different image in the same tile
                if (activeTileId === overTileId) {
                    return currentTiles.map(tile => {
                        if (tile.id === activeTileId) {
                            const oldIndex = tile.images.findIndex(img => img.id === activeImageId);
                            const newIndex = tile.images.findIndex(img => img.id === overImageId);
                            return { ...tile, images: arrayMove(tile.images, oldIndex, newIndex) };
                        }
                        return tile;
                    });
                }
                
                // This logic could be expanded to move images between tiles
                return currentTiles;
            });
        }
    }
  };
  
  const handleAddNewTile = () => {
    const newTile: MosaicTileData = {
        id: `new-tile-${Date.now()}`,
        layout: 'col-span-1 row-span-1', duration: 5000, animation: 'animate-fade-in-up',
        images: [{ id: `new-img-${Date.now()}`, src: 'https://placehold.co/600x400.png', alt: 'Placeholder', caption: 'Nueva Imagen', hint: 'placeholder' }]
    };
    setTiles(prev => [...prev, newTile]);
  };
  
  const handleSaveChanges = () => {
    setErrors({});
    startTransition(async () => {
      const result = await saveMosaicAction(tiles);
      if (result.success) {
        toast({ title: "¡Éxito!", description: result.message });
      } else {
        if (result.errors) {
            const errorMap: ErrorMap = {};
            result.errors.forEach((issue: ZodIssue) => {
                const tileIndex = issue.path[0] as number;
                const imageIndex = issue.path[2] as number;
                const fieldName = issue.path[3] as string;

                const tileId = tiles[tileIndex]?.id;
                
                if (tileId) {
                    const errorPath = `${tileId}.images[${imageIndex}].${fieldName}`;
                    errorMap[errorPath] = issue.message;
                }
            });
            setErrors(errorMap);
        }
        toast({ variant: "destructive", title: "Error de Validación", description: result.message });
      }
    });
  };

  return (
    <div className="space-y-6">
       <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tiles.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <Accordion type="multiple" className="w-full space-y-0">
            {tiles.map(tile => (
              <SortableTileItem key={tile.id} tile={tile} setTiles={setTiles} isPending={isPending} errors={errors} />
            ))}
          </Accordion>
        </SortableContext>
      </DndContext>
      <div className="flex justify-between items-center">
        <Button onClick={handleAddNewTile} disabled={isPending}><Plus className="mr-2 h-4 w-4" />Añadir Mosaico</Button>
        <Button onClick={handleSaveChanges} disabled={isPending} size="lg">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
