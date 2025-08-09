
"use client";

import React, { useState, useEffect } from 'react';
import { getAfiliacionSubmissions, type AfiliacionSubmission } from '@/lib/afiliacion-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AfiliacionesTable } from './AfiliacionesTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function ManageAfiliacionesPage() {
  const [submissions, setSubmissions] = useState<AfiliacionSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAfiliacionSubmissions()
      .then(data => {
        setSubmissions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load affiliations:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ver Afiliaciones</CardTitle>
        <CardDescription>
          Aquí puedes ver todas las solicitudes de afiliación enviadas desde el formulario del sitio web.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Cargando datos...</p>
          </div>
        ) : (
          <AfiliacionesTable initialData={submissions} />
        )}
      </CardContent>
    </Card>
  );
}
