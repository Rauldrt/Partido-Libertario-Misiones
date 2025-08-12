
"use client";

import React, { useState, useTransition } from 'react';
import type { TeamMember } from '@/lib/dynamic-sections-service';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GripVertical, Loader2, Plus, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageGallery } from '@/components/ImageGallery';

const SortableItem = ({ item, setItems, isPending, includeRole }: { item: TeamMember, setItems: React.Dispatch<React.SetStateAction<TeamMember[]>>, isPending: boolean, includeRole: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isGalleryOpen, setGalleryOpen] = useState(false);

  const handleInputChange = (field: keyof TeamMember, value: string) => {
    setItems(prev => prev.map(s => (s.id === item.id ? { ...s, [field]: value } : s)));
  };
  
  const handleDelete = () => {
    setItems(prev => prev.filter(s => s.id !== item.id));
  };
  
  const onImageSelect = (src: string) => {
    handleInputChange('imageUrl', src);
    setGalleryOpen(false);
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
        <Card className="mb-4 bg-muted/30">
             <CardHeader className="flex flex-row items-center justify-between p-3">
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" {...listeners} className="cursor-grab p-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <span className="font-semibold truncate">{item.name || 'Nuevo Miembro'}</span>
                 </div>
                 <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isPending}>
                     <Trash2 className="h-4 w-4" />
                 </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid gap-4">
                 <div className="space-y-2">
                    <Label htmlFor={`name-${item.id}`}>Nombre</Label>
                    <Input id={`name-${item.id}`} value={item.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                </div>
                 {includeRole && (
                     <div className="space-y-2">
                        <Label htmlFor={`role-${item.id}`}>Rol / Cargo</Label>
                        <Input id={`role-${item.id}`} value={item.role || ''} onChange={(e) => handleInputChange('role', e.target.value)} />
                    </div>
                 )}
                 <div className="space-y-2">
                    <Label htmlFor={`description-${item.id}`}>Descripción</Label>
                    <Textarea id={`description-${item.id}`} value={item.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={3}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor={`imageUrl-${item.id}`}>URL de Imagen</Label>
                    <div className="flex items-center gap-2">
                        <Input id={`imageUrl-${item.id}`} value={item.imageUrl} onChange={(e) => handleInputChange('imageUrl', e.target.value)} />
                        <Dialog open={isGalleryOpen} onOpenChange={setGalleryOpen}>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="outline" title="Seleccionar desde la galería">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl w-full h-[90vh]">
                                <DialogHeader>
                                    <DialogTitle>Galería de Imágenes</DialogTitle>
                                </DialogHeader>
                                <ImageGallery onImageSelect={onImageSelect} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`imageHint-${item.id}`}>Hint de Imagen (para IA)</Label>
                    <Input id={`imageHint-${item.id}`} value={item.imageHint} onChange={(e) => handleInputChange('imageHint', e.target.value)} placeholder="political portrait"/>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

interface TeamEditorClientProps {
    initialItems: TeamMember[];
    saveAction: (items: TeamMember[]) => Promise<{success: boolean; message: string;}>;
    itemType: 'Miembro' | 'Candidato'; // To customize text
}

export function TeamEditorClient({ initialItems, saveAction, itemType }: TeamEditorClientProps) {
  const [items, setItems] = useState<TeamMember[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        setItems((currentItems) => {
            const oldIndex = currentItems.findIndex((item) => item.id === active.id);
            const newIndex = currentItems.findIndex((item) => item.id === over.id);
            return arrayMove(currentItems, oldIndex, newIndex);
        });
    }
  };

  const handleAddNewItem = () => {
    const newItem: TeamMember = {
        id: `new-${Date.now()}`,
        name: `Nuevo ${itemType}`,
        description: 'Descripción del nuevo miembro.',
        imageUrl: 'https://placehold.co/400x400.png',
        imageHint: 'portrait person',
    };
    if (itemType === 'Miembro') {
        newItem.role = 'Nuevo Rol';
    }
    setItems(prev => [...prev, newItem]);
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const result = await saveAction(items);
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
            <SortableContext items={items.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {items.map(item => (
                    <SortableItem 
                        key={item.id} 
                        item={item} 
                        setItems={setItems} 
                        isPending={isPending}
                        includeRole={itemType === 'Miembro'}
                    />
                ))}
            </SortableContext>
        </DndContext>
        
        <div className="flex justify-between items-center">
            <Button onClick={handleAddNewItem} disabled={isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir {itemType}
            </Button>
            <Button onClick={handleSaveChanges} disabled={isPending} size="lg">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar Cambios
            </Button>
        </div>
    </div>
  );
}
    