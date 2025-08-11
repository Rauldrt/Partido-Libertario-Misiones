
"use client";

import React, { useState, useTransition } from 'react';
import type { FormDefinition, FormField, FormSubmission } from '@/lib/form-defs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Search, Trash2, Edit, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { SubmissionEditForm } from './SubmissionEditForm';

interface SubmissionTableProps {
  initialData: FormSubmission[];
  displayColumns: { key: string; label: string }[];
  exportFileName: string;
  formDefinition: FormDefinition;
  onDelete: (id: string) => Promise<{ success: boolean; message: string; }>;
  onUpdate: (id: string, data: Record<string, any>) => Promise<{ success: boolean; message: string; }>;
}

export function SubmissionTable({ initialData, displayColumns, exportFileName, formDefinition, onDelete, onUpdate }: SubmissionTableProps) {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState<FormSubmission | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const filteredData = data.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const downloadCSV = () => {
    const headers = displayColumns.map(col => col.label);
    const rows = filteredData.map(item => {
        return displayColumns.map(col => {
            let value = item[col.key];
            if (col.key === 'createdAt' && value instanceof Date) {
                value = format(value, "PPPp", { locale: es });
            }
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return String(value);
        }).join(',');
    });

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    startTransition(async () => {
        const result = await onDelete(itemToDelete.id);
        if (result.success) {
            setData(currentData => currentData.filter(d => d.id !== itemToDelete.id));
            toast({ title: "¡Éxito!", description: result.message });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
        setItemToDelete(null);
    });
  };

  const renderCell = (item: FormSubmission, key: string) => {
    const value = item[key];
    if (key === 'createdAt' && value instanceof Date) {
        return <span className="text-sm text-muted-foreground">{format(value, "PPP", { locale: es })}</span>;
    }
    if (typeof value === 'boolean') {
        return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Sí' : 'No'}</Badge>;
    }
    if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'))) {
        return <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{value}</a>
    }
    return <span className="truncate">{String(value)}</span>;
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar en todos los campos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
            <Button onClick={downloadCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar a CSV
            </Button>
        </div>
      <div className="rounded-md border">
        <ScrollArea className="w-full whitespace-nowrap">
            <Table>
                <TableHeader>
                    <TableRow>
                    {displayColumns.map(col => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                    <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <TableRow key={item.id}>
                            {displayColumns.map(col => (
                                <TableCell key={`${item.id}-${col.key}`}>
                                    {renderCell(item, col.key)}
                                </TableCell>
                            ))}
                            <TableCell className="text-right space-x-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Editar Envío</DialogTitle>
                                            <DialogDescription>Modificá los datos del registro. Los cambios se guardarán inmediatamente.</DialogDescription>
                                        </DialogHeader>
                                        <SubmissionEditForm
                                            formDefinition={formDefinition}
                                            submission={item}
                                            onSave={async (updatedData) => {
                                                const result = await onUpdate(item.id, updatedData);
                                                if (result.success) {
                                                    setData(currentData => currentData.map(d => d.id === item.id ? { ...d, ...updatedData } : d));
                                                }
                                                return result;
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>

                                <Button variant="destructive" size="icon" onClick={() => setItemToDelete(item)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={displayColumns.length + 1} className="h-24 text-center">
                        No se encontraron resultados.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
        </ScrollArea>
      </div>
        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción es permanente y no se puede deshacer. Esto eliminará el registro de la base de datos.
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
    </div>
  );
}
