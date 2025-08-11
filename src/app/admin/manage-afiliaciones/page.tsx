
'use client';

import React, { useState, useEffect } from 'react';
import { getAfiliacionSubmissions, deleteAfiliacionSubmission, updateAfiliacionSubmission } from '@/lib/afiliacion-service';
import { getAfiliacionFormDef } from '@/app/afiliacion/actions';
import type { FormSubmission, FormDefinition } from '@/lib/form-defs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionTable } from '@/components/SubmissionTable';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ManageAfiliacionesPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [formDef, setFormDef] = useState<FormDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
        getAfiliacionSubmissions(),
        getAfiliacionFormDef()
    ]).then(([submissionData, formDefData]) => {
        setSubmissions(submissionData);
        setFormDef(formDefData);
    }).catch(error => {
        console.error("Failed to load data:", error);
        setError("No se pudieron cargar los datos. Por favor, intente de nuevo.");
    }).finally(() => {
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
          Aquí puedes ver, editar y eliminar los datos de las personas que han completado el formulario de afiliación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">Cargando afiliaciones...</p>
            </div>
        ) : error ? (
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : formDef ? (
            <SubmissionTable
              initialData={submissions}
              displayColumns={displayColumns}
              exportFileName="afiliaciones.csv"
              formDefinition={formDef}
              onDelete={deleteAfiliacionSubmission}
              onUpdate={updateAfiliacionSubmission}
            />
        ) : null}
      </CardContent>
    </Card>
  );
}
