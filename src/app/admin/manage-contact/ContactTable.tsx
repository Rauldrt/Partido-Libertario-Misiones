
"use client";

import React, { useState } from 'react';
import type { ContactSubmission } from '@/lib/contact-service';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ContactTable({ initialData }: { initialData: ContactSubmission[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = initialData.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = ['Fecha', 'Nombre Completo', 'Email', 'Mensaje'];
    const rows = filteredData.map(item => [
      format(item.createdAt, "PPPp", { locale: es }),
      `"${item.fullName}"`,
      item.email,
      `"${item.message.replace(/"/g, '""')}"` // Handle quotes in message
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mensajes_contacto.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
            <Input
                placeholder="Buscar por nombre o email..."
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
              <TableHead className="hidden md:table-cell">Fecha de Envío</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mensaje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <TableRow className="cursor-pointer">
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{format(item.createdAt, "PPP", { locale: es })}</TableCell>
                      <TableCell className="font-medium">{item.fullName}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell className="truncate max-w-[200px]">{item.message}</TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mensaje de {item.fullName}</DialogTitle>
                      <DialogDescription>
                        Enviado el {format(item.createdAt, "PPPp", { locale: es })}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 whitespace-pre-wrap">{item.message}</div>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
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
