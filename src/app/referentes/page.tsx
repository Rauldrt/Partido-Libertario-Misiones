
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function ReferentesPage() {
  return (
    <>
      <Section id="referentes-header" className="py-12 md:py-16 bg-gradient-to-br from-blue-800 to-indigo-700 text-white">
        <div className="text-center">
          <Star className="h-20 w-20 text-accent mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">Nuestros Referentes</h1>
          <p className="font-body text-xl max-w-3xl mx-auto text-primary-foreground/90">
            Conocé a las personas que lideran e inspiran nuestro movimiento en la provincia de Misiones.
          </p>
        </div>
      </Section>

      <Section id="referentes-list" className="py-10">
        <div className="max-w-4xl mx-auto">
           <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Lista de Referentes</CardTitle>
                    <CardDescription>
                        Próximamente, aquí encontrarás la lista de nuestros principales referentes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">La funcionalidad para mostrar referentes está en desarrollo.</p>
                    </div>
                </CardContent>
           </Card>
        </div>
      </Section>
    </>
  );
}
