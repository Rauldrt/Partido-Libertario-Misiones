
"use client";

import React, { useState } from 'react';
import type { ReferenteData } from '@/lib/referentes-service';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { PageHeaderData } from '@/lib/page-headers-service';
import Image from 'next/image';
import { DynamicIcon } from '@/components/DynamicIcon';

export function ReferentesPageClient({ initialReferentes, headerData }: { initialReferentes: ReferenteData[], headerData: PageHeaderData }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReferentes = initialReferentes.filter(
    (referente) =>
      referente.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referente.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Section 
        id="referentes-header" 
        className="py-12 md:py-16 text-white"
        backgroundImage={headerData.backgroundImage}
        backgroundOverlay="bg-black/60"
        parallax={true}
      >
        <div className="text-center">
          <DynamicIcon name={headerData.icon} className="h-20 w-20 text-accent mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{headerData.title}</h1>
          <p className="font-body text-xl max-w-3xl mx-auto text-primary-foreground/90">
            {headerData.description}
          </p>
        </div>
      </Section>

      <Section id="referentes-list" className="py-10">
        <div className="grid md:grid-cols-5 gap-12 items-start max-w-6xl mx-auto">
          <div className="md:col-span-3">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Referentes por Localidad</CardTitle>
                <CardDescription>
                  Usá el buscador para encontrar a tu referente por localidad o nombre.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por localidad o nombre..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {filteredReferentes.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {filteredReferentes.map((referente) => (
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
                    <p className="text-muted-foreground text-center">
                      No se encontraron referentes con ese criterio de búsqueda.
                      <br />
                      Intenta con otro término.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            {headerData.featuredImage && (
              <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
                <Image src={headerData.featuredImage} alt={headerData.featuredImageTitle || "Imagen destacada de referentes"} layout="fill" objectFit="cover" data-ai-hint="team leaders" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                    {headerData.featuredImageTitle && (
                        <h3 className="font-headline text-3xl text-white font-bold text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>
                            {headerData.featuredImageTitle}
                        </h3>
                    )}
                </div>
              </div>
            )}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Sé un Referente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-muted-foreground mb-4">
                  ¿Querés ser la voz de la libertad en tu localidad? ¡Tu participación es clave!
                </p>
                <Button asChild>
                  <a href="/contact">
                    Contactanos
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
