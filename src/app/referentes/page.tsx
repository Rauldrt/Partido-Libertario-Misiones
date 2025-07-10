
import { getReferentes } from '@/lib/referentes-service';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default async function ReferentesPage() {
  const referentes = await getReferentes();

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
              <CardTitle>Referentes por Localidad</CardTitle>
              <CardDescription>
                Expandí una localidad para ver las opciones de contacto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referentes.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {referentes.map((referente) => (
                    <AccordionItem key={referente.id} value={referente.id} className="border-b-0">
                       <Card className="bg-muted/30">
                          <AccordionTrigger className="p-4 hover:no-underline">
                              <div className="flex flex-col text-left">
                                  <h3 className="font-headline text-lg text-primary">{referente.locality}</h3>
                                  <p className="font-body text-md text-muted-foreground">{referente.name}</p>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                              <Button asChild className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                                <a href={`https://wa.me/${referente.phone}`} target="_blank" rel="noopener noreferrer">
                                  <MessageCircle className="mr-2 h-5 w-5" />
                                  Enviar WhatsApp
                                </a>
                              </Button>
                          </AccordionContent>
                       </Card>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Aún no se han cargado referentes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
