
"use client";

import { useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle } from 'lucide-react';

export default function LocationPage() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('La geolocalización no es soportada por tu navegador.');
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setStatus('success');
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setStatus('error');
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError('Permiso de ubicación denegado. Por favor, habilítalo en la configuración de tu navegador si deseas utilizar esta función.');
          break;
        case error.POSITION_UNAVAILABLE:
          setError('La información de ubicación no está disponible.');
          break;
        case error.TIMEOUT:
          setError('La solicitud para obtener la ubicación ha caducado.');
          break;
        default:
          setError('Ocurrió un error desconocido al obtener la ubicación.');
          break;
      }
    };

    // This triggers the browser's permission prompt
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <Section id="location-section" className="py-12 md:py-16">
      <div className="text-center mb-12">
        <MapPin className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Detección de Ubicación</h1>
        <p className="font-body text-xl text-muted-foreground mt-2">
          Si lo permitís, podemos detectar tu ubicación actual.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Estado de la Geolocalización</CardTitle>
          <CardDescription>
            A continuación se muestra el resultado de la solicitud de ubicación.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8 min-h-[150px]">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="font-body text-lg">Solicitando permiso y obteniendo ubicación...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 text-destructive text-center">
              <AlertTriangle className="h-10 w-10" />
              <p className="font-body text-lg font-semibold">Error al obtener la ubicación</p>
              <p className="font-body text-base">{error}</p>
            </div>
          )}
          {status === 'success' && location && (
            <div className="text-center space-y-2">
               <h3 className="font-headline text-2xl text-primary">¡Ubicación Obtenida!</h3>
               <p className="font-body text-lg">
                 <span className="font-semibold">Latitud:</span> {location.latitude.toFixed(6)}
               </p>
               <p className="font-body text-lg">
                 <span className="font-semibold">Longitud:</span> {location.longitude.toFixed(6)}
               </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
