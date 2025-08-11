
'use client';

import React, { useState, useEffect } from 'react';
import { getFiscalizacionSubmissions, deleteFiscalizacionSubmission, updateFiscalizacionSubmission } from '@/lib/fiscalizacion-service';
import { getFiscalizacionFormDef } from '@/app/fiscalizacion/actions';
import type { FormSubmission, FormDefinition } from '@/lib/form-defs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionTable } from '@/components/SubmissionTable';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ManageFiscalesPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [formDef, setFormDef] = useState<FormDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
     Promise.all([
        getFiscalizacionSubmissions(),
        getFiscalizacionFormDef()
    ]).then(([submissionData, formDefData]) => {
        setSubmissions(submissionData);
        setFormDef(formDefData);
    }).catch(error => {
        console.error("Failed to load fiscalizacion data:", error);
        setError("No se pudieron cargar los fiscales. Por favor, intente de nuevo.");
    }).finally(() => {
        setIsLoading(false);
    });
  }, []);
  
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
          Aquí puedes ver, editar y eliminar los datos de los voluntarios para fiscalizar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">Cargando fiscales...</p>
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
              exportFileName="fiscales.csv"
              formDefinition={formDef}
              onDelete={deleteFiscalizacionSubmission}
              onUpdate={updateFiscalizacionSubmission}
            />
        ) : null}
      </CardContent>
    </Card>
  );
}
