
"use client";

import React, { useState, useTransition } from 'react';
import type { AccordionItemData } from '@/lib/homepage-service';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GripVertical, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveAccordionItemsAction } from './actions';

const SortableItem = ({ item, setItems, isPending }: { item: AccordionItemData, setItems: React.Dispatch<React.SetStateAction<AccordionItemData[]>>, isPending: boolean }) => {
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

  const handleInputChange = (field: keyof AccordionItemData, value: string) => {
    setItems(prev => prev.map(s => (s.id === item.id ? { ...s, [field]: value } : s)));
  };
  
  const handleDelete = () => {
    setItems(prev => prev.filter(s => s.id !== item.id));
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
        <Card className="mb-4 bg-muted/30">
             <CardHeader className="flex flex-row items-center justify-between p-3">
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" {...listeners} className="cursor-grab p-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <span className="font-semibold truncate">{item.title || 'Nuevo Panel'}</span>
                 </div>
                 <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isPending}>
                     <Trash2 className="h-4 w-4" />
                 </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid gap-4">
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`title-${item.id}`}>Título</Label>
                        <Input id={`title-${item.id}`} value={item.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`icon-${item.id}`}>Icono (de Lucide-React)</Label>
                        <Input id={`icon-${item.id}`} value={item.icon} onChange={(e) => handleInputChange('icon', e.target.value)} placeholder="Ej: Goal, Eye, Heart" />
                    </div>
                 </div>
                <div className="space-y-2">
                    <Label htmlFor={`content-${item.id}`}>Contenido</Label>
                    <Textarea id={`content-${item.id}`} value={item.content} onChange={(e) => handleInputChange('content', e.target.value)} rows={3} />
                </div>
            </CardContent>
        </Card>
    </div>
  );
};


export function AccordionEditorClient({ initialItems }: { initialItems: AccordionItemData[] }) {
  const [items, setItems] = useState<AccordionItemData[]>(initialItems);
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
    const newItem: AccordionItemData = {
        id: `new-${Date.now()}`,
        value: 'new-item',
        title: 'Nuevo Panel',
        icon: 'Info',
        content: 'Contenido del nuevo panel.'
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const result = await saveAccordionItemsAction(items);
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
                    <SortableItem key={item.id} item={item} setItems={setItems} isPending={isPending} />
                ))}
            </SortableContext>
        </DndContext>
        
        <div className="flex justify-between items-center">
            <Button onClick={handleAddNewItem} disabled={isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Panel
            </Button>
            <Button onClick={handleSaveChanges} disabled={isPending} size="lg">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar Cambios
            </Button>
        </div>
    </div>
  );
}
