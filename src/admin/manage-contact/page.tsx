
'use client';

import React, { useState, useEffect } from 'react';
import { getContactSubmissions, type ContactSubmission } from '@/lib/contact-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactTable } from './ContactTable';
import { Loader2 } from 'lucide-react';

export default function ManageContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getContactSubmissions()
      .then(data => {
        setSubmissions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load contact messages:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Mensajes de Contacto</CardTitle>
        <CardDescription>
          Aquí puedes ver todos los mensajes enviados desde el formulario de contacto del sitio web.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">Cargando mensajes...</p>
            </div>
        ) : (
            <ContactTable initialData={submissions} />
        )}
      </CardContent>
    </Card>
  );
}
