
"use client";

import React, { useState, useTransition } from 'react';
import type { NewsCardData } from '@/lib/news-service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { deleteNewsItemAction, reorderNewsItemsAction, togglePublishStatusAction, duplicateNewsItemAction } from './actions';
import { Copy, FilePenLine, GripVertical, Loader2, Newspaper, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';

const SortableRow = ({
  item,
  handlePublishToggle,
  handleDeleteClick,
  handleDuplicateClick,
  isPending
}: {
  item: NewsCardData;
  handlePublishToggle: (id: string, currentStatus: boolean) => void;
  handleDeleteClick: (item: NewsCardData) => void;
  handleDuplicateClick: (id: string) => void;
  isPending: boolean;
}) => {
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
    zIndex: isDragging ? 1 : 'auto',
    position: 'relative',
    background: isDragging ? 'hsl(var(--card))' : 'transparent',
  };
  
  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} data-state={isDragging && "selected"}>
        <TableCell className="w-[32px] cursor-grab touch-none p-2" {...listeners}>
            <GripVertical className="h-5 w-5 text-muted-foreground" />
        </TableCell>
        <TableCell>
            {item.imageUrl && item.imageUrl.trim() !== '' ? (
                <img src={item.imageUrl} alt={item.title} width={64} height={36} className="rounded-sm object-cover aspect-video" />
            ) : (
                <div className="w-16 h-9 bg-muted rounded-sm flex items-center justify-center">
                    <Newspaper className="h-5 w-5 text-muted-foreground" />
                </div>
            )}
        </TableCell>
        <TableCell className="font-medium">{item.title}</TableCell>
        <TableCell className="hidden md:table-cell capitalize">{item.type}</TableCell>
        <TableCell className="hidden sm:table-cell">{item.date}</TableCell>
        <TableCell className="text-center">
            <Badge variant={item.published ? 'default' : 'secondary'}>
            {item.published ? 'Publicado' : 'Oculto'}
            </Badge>
        </TableCell>
        <TableCell className="text-right space-x-2">
            <Switch
            checked={item.published}
            onCheckedChange={() => handlePublishToggle(item.id, item.published)}
            aria-label="Publicar"
            disabled={isPending}
            />
            <Button asChild variant="outline" size="icon" disabled={isPending}>
                <Link href={`/admin/news-generator?edit=${item.id}`}>
                    <FilePenLine className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                </Link>
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleDuplicateClick(item.id)} disabled={isPending}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copiar</span>
            </Button>
            <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDeleteClick(item)}
            disabled={isPending}
            >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
            </Button>
        </TableCell>
    </TableRow>
  )
}

export function ContentTableClient({ initialItems }: { initialItems: NewsCardData[] }) {
  const [items, setItems] = useState<NewsCardData[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [itemToDelete, setItemToDelete] = useState<NewsCardData | null>(null);
  const { toast } = useToast();

  const handlePublishToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      // Optimistic update
      const originalItems = items;
      setItems(currentItems =>
        currentItems.map(item =>
          item.id === id ? { ...item, published: !currentStatus } : item
        )
      );

      const result = await togglePublishStatusAction(id, currentStatus);
      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error al actualizar',
          description: result.message,
        });
        // Revert optimistic update on failure
        setItems(originalItems);
      }
    });
  };

  const handleDuplicateClick = (id: string) => {
    startTransition(async () => {
      const result = await duplicateNewsItemAction(id);
      if(result.success && result.newItem) {
        setItems(currentItems => [result.newItem!, ...currentItems]);
        toast({
          title: 'Contenido Duplicado',
          description: `Se creó una copia llamada "${result.newItem.title}". Está oculta por defecto.`,
        });
      } else {
         toast({
          variant: 'destructive',
          title: 'Error al duplicar',
          description: result.message,
        });
      }
    });
  };

  const handleDeleteClick = (item: NewsCardData) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    startTransition(async () => {
      const originalItems = items;
      // Optimistic update
      setItems(currentItems => currentItems.filter(item => item.id !== itemToDelete.id));

      const result = await deleteNewsItemAction(itemToDelete.id);
      setItemToDelete(null); // Close dialog

      if (result.success) {
        toast({
          title: 'Contenido Eliminado',
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error al eliminar',
          description: result.message,
        });
        // Revert optimistic update
        setItems(originalItems);
      }
    });
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        startTransition(async () => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            const reorderedItems = arrayMove(items, oldIndex, newIndex);
            
            const originalItems = items;
            setItems(reorderedItems); // Optimistic update
            
            const orderedIds = reorderedItems.map((item) => item.id);
            const result = await reorderNewsItemsAction(orderedIds);
            
            if (!result.success) {
                toast({
                    variant: 'destructive',
                    title: 'Error al Reordenar',
                    description: result.message,
                });
                setItems(originalItems); // Revert on failure
            } else {
                 toast({
                    title: 'Contenido Reordenado',
                    description: 'El orden de las noticias ha sido actualizado.',
                });
            }
        });
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[32px] p-0" />
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    {items.map((item) => (
                        <SortableRow
                            key={item.id}
                            item={item}
                            handlePublishToggle={handlePublishToggle}
                            handleDeleteClick={handleDeleteClick}
                            handleDuplicateClick={handleDuplicateClick}
                            isPending={isPending}
                        />
                    ))}
                </SortableContext>
            </TableBody>
            </Table>
        </DndContext>
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es permanente y no se puede deshacer. Esto eliminará el artículo <span className="font-bold">"{itemToDelete?.title}"</span> de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
