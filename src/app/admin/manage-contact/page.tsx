
'use client';

import React, { useState, useEffect } from 'react';
import { getContactSubmissions, deleteContactSubmission, updateContactSubmission } from '@/lib/contact-service';
import { getFormDefinition } from '@/lib/form-service';
import type { FormSubmission, FormDefinition } from '@/lib/form-defs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionTable } from '@/components/SubmissionTable';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ManageContactPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [formDef, setFormDef] = useState<FormDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
        getContactSubmissions(),
        getFormDefinition('contacto')
    ]).then(([submissionData, formDefData]) => {
        setSubmissions(submissionData);
        setFormDef(formDefData);
    }).catch(error => {
        console.error("Failed to load contact data:", error);
        setError("No se pudieron cargar los mensajes. Por favor, intente de nuevo.");
    }).finally(() => {
        setIsLoading(false);
    });
  }, []);
  
  const displayColumns = [
    { key: 'createdAt', label: 'Fecha de Envío' },
    { key: 'fullName', label: 'Nombre Completo' },
    { key: 'email', label: 'Email' },
    { key: 'message', label: 'Mensaje' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Mensajes de Contacto</CardTitle>
        <CardDescription>
          Aquí puedes ver, editar y eliminar los mensajes enviados desde el formulario de contacto del sitio web.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">Cargando mensajes...</p>
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
              exportFileName="mensajes_contacto.csv"
              formDefinition={formDef}
              onDelete={deleteContactSubmission}
              onUpdate={updateContactSubmission}
            />
        ) : null}
      </CardContent>
    </Card>
  );
}
