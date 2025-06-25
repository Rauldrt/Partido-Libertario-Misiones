
import { FiscalizacionForm } from '@/components/FiscalizacionForm';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function FiscalizacionPage() {
  return (
    <>
      <Section id="fiscalizacion-header" className="py-12 md:py-16 bg-gradient-to-br from-orange-700 to-amber-500 text-white">
        <div className="text-center">
          <ShieldCheck className="h-20 w-20 text-accent mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">Defendé el Voto</h1>
          <p className="font-body text-xl max-w-3xl mx-auto text-primary-foreground/90">
            La defensa de la libertad también se juega en las urnas. Tu rol como fiscal es crucial para garantizar la transparencia y el respeto a la voluntad popular. ¡Sumate al equipo de fiscales!
          </p>
        </div>
      </Section>

      <Section id="fiscalizacion-form-section" className="py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <Card className="shadow-2xl w-full">
            <CardHeader>
              <CardTitle className="font-headline text-2xl md:text-3xl">Formulario de Inscripción</CardTitle>
              <CardDescription className="font-body text-md">
                Completá tus datos para ser parte del equipo de fiscales del Partido Libertario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FiscalizacionForm />
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">El Rol del Fiscal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-body text-muted-foreground">
                    <p>✓ Garantizar la transparencia en tu mesa de votación.</p>
                    <p>✓ Asegurar que cada voto para la libertad sea contado.</p>
                    <p>✓ Reportar y documentar cualquier irregularidad.</p>
                    <p>✓ Ser los ojos del partido en cada escuela.</p>
                </CardContent>
            </Card>
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                 <Image src="/banner2.jpg" alt="Personas en una mesa de votación" layout="fill" objectFit="cover" data-ai-hint="election polling station" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                     <h3 className="font-headline text-3xl text-white font-bold text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>Cada Voto Cuenta</h3>
                 </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
