
"use client";

import React, { useState } from 'react';
import type { FiscalizacionSubmission } from '@/lib/fiscalizacion-service';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Check, X } from 'lucide-react';


export function FiscalesTable({ initialData }: { initialData: FiscalizacionSubmission[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = initialData.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = ['Fecha', 'Nombre Completo', 'DNI', 'Email', 'Teléfono', 'Localidad', 'Experiencia Previa', 'Disponibilidad', 'Notas'];
    const rows = filteredData.map(item => [
      format(item.createdAt, "PPPp", { locale: es }),
      `"${item.fullName}"`,
      item.dni,
      item.email,
      item.phone,
      `"${item.city}"`,
      item.previousExperience ? 'Sí' : 'No',
      item.availability,
      `"${item.notes || ''}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fiscales.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
            <Input
                placeholder="Buscar por nombre, DNI o localidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <Button onClick={downloadCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar a CSV
            </Button>
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">DNI</TableHead>
                <TableHead>Localidad</TableHead>
                <TableHead className="hidden lg:table-cell">Disponibilidad</TableHead>
                <TableHead className="text-center">Exp. Previa</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredData.length > 0 ? (
                filteredData.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{format(item.createdAt, "PPP", { locale: es })}</TableCell>
                    <TableCell className="font-medium">{item.fullName}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.dni}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell className="hidden lg:table-cell capitalize">{item.availability}</TableCell>
                    <TableCell className="text-center">
                    {item.previousExperience ? 
                        <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                        <X className="h-5 w-5 text-destructive mx-auto" />}
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron resultados.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
    </div>
  );
}

