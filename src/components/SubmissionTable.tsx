
"use client";

import React, { useState } from 'react';
import type { FormSubmission } from '@/lib/form-defs';
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
import { Download, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface SubmissionTableProps {
  initialData: FormSubmission[];
  displayColumns: { key: string; label: string }[];
  exportFileName: string;
}

export function SubmissionTable({ initialData, displayColumns, exportFileName }: SubmissionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = initialData.filter(item => {
    // Search across all string/number values in the item
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
  }

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
  }

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
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <Dialog key={item.id}>
                    <DialogTrigger asChild>
                        <TableRow className="cursor-pointer">
                            {displayColumns.map(col => (
                                <TableCell key={`${item.id}-${col.key}`}>
                                    {renderCell(item, col.key)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Detalle del Envío</DialogTitle>
                        <DialogDescription>
                            Enviado el {format(item.createdAt, "PPPp", { locale: es })}
                        </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh]">
                            <div className="py-4 space-y-4 pr-4">
                                {Object.entries(item).filter(([key]) => key !== 'id' && key !== 'createdAt').map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-3 gap-4">
                                        <dt className="font-semibold capitalize text-muted-foreground col-span-1">{key.replace(/_/g, ' ')}</dt>
                                        <dd className="col-span-2">{renderCell(item, key)}</dd>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                    </Dialog>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={displayColumns.length} className="h-24 text-center">
                    No se encontraron resultados.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
