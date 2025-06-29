
'use client';

import { LocationDisplay } from '@/components/LocationDisplay';
import { Section } from '@/components/ui/Section';
import { MapPin } from 'lucide-react';

export default function LocationPage() {
  return (
    <Section id="location" className="py-12 md:py-16">
      <div className="text-center mb-12">
        <MapPin className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Nuestra Ubicación</h1>
        <p className="font-body text-xl text-muted-foreground mt-2">
          Hacé clic en el botón para compartir tu ubicación y verla en el mapa.
        </p>
      </div>
      <div className="max-w-md mx-auto">
        <LocationDisplay />
      </div>
    </Section>
  );
}
