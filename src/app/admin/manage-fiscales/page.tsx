
"use client";

import React, { useState, useEffect } from 'react';
import { getFiscalizacionSubmissions, type FiscalizacionSubmission } from '@/lib/fiscalizacion-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FiscalesTable } from './FiscalesTable';
import { Loader2 } from 'lucide-react';

export default function ManageFiscalesPage() {
  const [submissions, setSubmissions] = useState<FiscalizacionSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFiscalizacionSubmissions()
      .then(data => {
        setSubmissions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load fiscalization submissions:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Inscriptos para Fiscalización</CardTitle>
        <CardDescription>
          Aquí puedes ver todos los voluntarios inscriptos desde el formulario del sitio web.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">Cargando inscriptos...</p>
            </div>
        ) : (
            <FiscalesTable initialData={submissions} />
        )}
      </CardContent>
    </Card>
  );
}
