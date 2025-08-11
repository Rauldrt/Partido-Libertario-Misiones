
'use client';

import React, { useState, useEffect } from 'react';
import { getFiscalizacionSubmissions } from '@/lib/fiscalizacion-service';
import type { FormSubmission } from '@/lib/form-defs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionTable } from '@/components/SubmissionTable';
import { Loader2 } from 'lucide-react';

export default function ManageFiscalesPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFiscalizacionSubmissions()
      .then(data => {
        setSubmissions(data);
      })
      .catch(error => {
        console.error("Failed to load fiscalizacion submissions:", error);
        setError("No se pudieron cargar los fiscales. Por favor, intente de nuevo.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  // Define las columnas que quieres mostrar en la tabla principal
  const displayColumns = [
    { key: 'createdAt', label: 'Fecha' },
    { key: 'fullName', label: 'Nombre Completo' },
    { key: 'dni', label: 'DNI' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'city', label: 'Localidad a Fiscalizar' },
    { key: 'previousExperience', label: '¿Tiene Experiencia?' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Inscriptos para Fiscalización</CardTitle>
        <CardDescription>
          Aquí puedes ver todos los datos de las personas que se han ofrecido como voluntarios para fiscalizar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">Cargando fiscales...</p>
            </div>
        ) : error ? (
            <div className="text-center p-12 text-destructive">{error}</div>
        ) : (
            <SubmissionTable
              initialData={submissions}
              displayColumns={displayColumns}
              exportFileName="fiscales.csv"
            />
        )}
      </CardContent>
    </Card>
  );
}
