
'use client';

import React, { useState, useEffect } from 'react';
import { getAfiliacionSubmissions } from '@/lib/afiliacion-service';
import type { FormSubmission } from '@/lib/form-defs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionTable } from '@/components/SubmissionTable';
import { Loader2 } from 'lucide-react';

export default function ManageAfiliacionesPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAfiliacionSubmissions()
      .then(data => {
        setSubmissions(data);
      })
      .catch(error => {
        console.error("Failed to load afiliacion submissions:", error);
        setError("No se pudieron cargar las afiliaciones. Por favor, intente de nuevo.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  const displayColumns = [
    { key: 'createdAt', label: 'Fecha' },
    { key: 'fullName', label: 'Nombre Completo' },
    { key: 'dni', label: 'DNI' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'city', label: 'Localidad' },
    { key: 'address', label: 'Dirección' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Solicitudes de Afiliación</CardTitle>
        <CardDescription>
          Aquí puedes ver todos los datos de las personas que han completado el formulario de afiliación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">Cargando afiliaciones...</p>
            </div>
        ) : error ? (
            <div className="text-center p-12 text-destructive">{error}</div>
        ) : (
            <SubmissionTable
              initialData={submissions}
              displayColumns={displayColumns}
              exportFileName="afiliaciones.csv"
            />
        )}
      </CardContent>
    </Card>
  );
}
