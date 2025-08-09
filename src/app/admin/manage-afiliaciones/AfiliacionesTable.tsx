
"use client";

import React, { useState } from 'react';
import type { AfiliacionSubmission } from '@/lib/afiliacion-service';
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
import { Download } from 'lucide-react';

export function AfiliacionesTable({ initialData }: { initialData: AfiliacionSubmission[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = initialData.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = ['Fecha', 'Nombre Completo', 'DNI', 'Email', 'Teléfono', 'Localidad', 'Dirección'];
    const rows = filteredData.map(item => [
      format(item.createdAt, "PPPp", { locale: es }),
      `"${item.fullName}"`,
      item.dni,
      item.email,
      item.phone,
      `"${item.city}"`,
      `"${item.address}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "afiliaciones.csv");
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
              <TableHead>Fecha de Envío</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
              <TableHead>Localidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm text-muted-foreground">{format(item.createdAt, "PPP", { locale: es })}</TableCell>
                  <TableCell className="font-medium">{item.fullName}</TableCell>
                  <TableCell>{item.dni}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{item.phone}</TableCell>
                  <TableCell>{item.city}</TableCell>
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
