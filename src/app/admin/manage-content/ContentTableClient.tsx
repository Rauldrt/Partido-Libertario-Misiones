
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
import { deleteNewsItemAction, togglePublishStatusAction } from './actions';
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';

export function ContentTableClient({ initialItems }: { initialItems: NewsCardData[] }) {
  const [items, setItems] = useState<NewsCardData[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [itemToDelete, setItemToDelete] = useState<NewsCardData | null>(null);
  const { toast } = useToast();

  const handlePublishToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      // Optimistic update
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
        setItems(currentItems =>
            currentItems.map(item =>
              item.id === id ? { ...item, published: currentStatus } : item
            )
        );
      }
    });
  };

  const handleDeleteClick = (item: NewsCardData) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const originalItems = items;

    startTransition(async () => {
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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Image src={item.imageUrl} alt={item.title} width={64} height={36} className="rounded-sm object-cover aspect-video" />
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
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es permanente y no se puede deshacer. Esto eliminará el artículo <span className="font-bold">"{itemToDelete?.title}"</span> del sitio.
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
