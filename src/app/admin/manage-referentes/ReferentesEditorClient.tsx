
"use client";

import React, { useState, useTransition } from 'react';
import type { ReferenteData } from './actions'; // Updated import path
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GripVertical, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveReferentesAction } from './actions';

const SortableReferenteItem = ({ referente, setReferentes, isPending }: { referente: ReferenteData, setReferentes: React.Dispatch<React.SetStateAction<ReferenteData[]>>, isPending: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: referente.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleInputChange = (field: keyof Omit<ReferenteData, 'id'>, value: string) => {
    setReferentes(prev => prev.map(r => (r.id === referente.id ? { ...r, [field]: value } : r)));
  };
  
  const handleDelete = () => {
    setReferentes(prev => prev.filter(r => r.id !== referente.id));
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
        <Card className="mb-4 bg-muted/30">
             <CardHeader className="flex flex-row items-center justify-between p-3">
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" {...listeners} className="cursor-grab p-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <span className="font-semibold truncate">{referente.name || 'Nuevo Referente'}</span>
                 </div>
                 <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isPending}>
                     <Trash2 className="h-4 w-4" />
                 </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor={`locality-${referente.id}`}>Localidad</Label>
                    <Input id={`locality-${referente.id}`} value={referente.locality} onChange={(e) => handleInputChange('locality', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`name-${referente.id}`}>Nombre y Apellido</Label>
                    <Input id={`name-${referente.id}`} value={referente.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`phone-${referente.id}`}>Teléfono (solo números)</Label>
                    <Input id={`phone-${referente.id}`} value={referente.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="5493764123456" />
                </div>
            </CardContent>
        </Card>
    </div>
  );
};


export function ReferentesEditorClient({ initialReferentes }: { initialReferentes: ReferenteData[] }) {
  const [referentes, setReferentes] = useState<ReferenteData[]>(initialReferentes);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        setReferentes((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };

  const handleAddNew = () => {
    const newItem: ReferenteData = {
        id: `new-${Date.now()}`,
        locality: '',
        name: '',
        phone: '549'
    };
    setReferentes(prev => [...prev, newItem]);
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const result = await saveReferentesAction(referentes);
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
            <SortableContext items={referentes.map(r => r.id)} strategy={verticalListSortingStrategy}>
                {referentes.map(item => (
                    <SortableReferenteItem key={item.id} referente={item} setReferentes={setReferentes} isPending={isPending} />
                ))}
            </SortableContext>
        </DndContext>
        
        {referentes.length === 0 && (
            <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No hay referentes. ¡Añade el primero!</p>
            </div>
        )}

        <div className="flex justify-between items-center">
            <Button onClick={handleAddNew} disabled={isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Referente
            </Button>
            <Button onClick={handleSaveChanges} disabled={isPending} size="lg">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar Cambios
            </Button>
        </div>
    </div>
  );
}
