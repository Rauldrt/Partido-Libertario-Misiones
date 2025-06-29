
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';

type Location = {
  latitude: number;
  longitude: number;
};

export function LocationDisplay() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por tu navegador.');
      return;
    }

    setLoading(true);
    setError(null);
    setLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(`Error al obtener la ubicación: ${err.message}`);
        setLoading(false);
      }
    );
  };

  return (
    <Card className="shadow-lg text-center">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Compartir Ubicación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleGetLocation} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Obteniendo...
            </>
          ) : (
            'Obtener mi Ubicación Actual'
          )}
        </Button>

        {location && (
          <div className="p-4 bg-primary/10 rounded-lg text-left">
            <h3 className="font-headline text-lg flex items-center text-primary">
              <MapPin className="mr-2 h-5 w-5" />
              ¡Ubicación Obtenida!
            </h3>
            <p className="font-body mt-2">
              <strong>Latitud:</strong> {location.latitude.toFixed(6)}
            </p>
            <p className="font-body">
              <strong>Longitud:</strong> {location.longitude.toFixed(6)}
            </p>
             <p className="text-xs text-muted-foreground mt-4">
               Nota: Esta es una demostración. La ubicación no se está guardando ni compartiendo con nadie.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center">
            <AlertTriangle className="mr-3 h-5 w-5 flex-shrink-0" />
            <p className="font-body text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
