import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getPageHeaderData } from '@/lib/page-headers-service';
import Image from 'next/image';
import type { PageHeaderData } from '@/lib/page-headers-service';
import { DynamicIcon } from '@/components/DynamicIcon';
import { AfiliacionForm } from './AfiliacionForm';
import { getAfiliacionFormDef } from './actions';
import { notFound } from 'next/navigation';


export default async function AfiliacionPage() {
  const headerData = await getPageHeaderData('afiliacion');
  const formDefinition = await getAfiliacionFormDef();

  if (!formDefinition) {
    notFound();
  }
  
  const pageData: PageHeaderData = headerData || {
    title: "Sumate Libertario",
    description: "Tu participación es el motor del cambio. Al afiliarte, no solo apoyás las ideas de la libertad, sino que te convertís en un protagonista activo en la construcción de una Misiones más próspera y libre.",
    icon: "UserPlus",
    backgroundImage: "/afilia1.webp"
  };
  
  return (
    <>
      <Section 
        id="afiliacion-header" 
        className="py-12 md:py-16 text-white"
        backgroundImage={pageData.backgroundImage}
        backgroundOverlay="bg-black/60"
        parallax={true}
      >
        <div className="text-center">
          <DynamicIcon name={pageData.icon} className="h-20 w-20 text-accent mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{pageData.title}</h1>
          <p className="font-body text-xl max-w-3xl mx-auto text-primary-foreground/90">
            {pageData.description}
          </p>
        </div>
      </Section>

      <Section id="afiliacion-form-section" className="py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <Card className="shadow-2xl w-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl md:text-3xl">Formulario de Afiliación</CardTitle>
              <CardDescription className="font-body text-md">
                Completá tus datos para unirte oficialmente al Partido Libertario de Misiones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AfiliacionForm formDefinition={formDefinition} />
            </CardContent>
          </Card>
          
          <div className="space-y-8 sticky top-24">
            <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">¿Por qué Afiliarse?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-body text-muted-foreground">
                    <p>✓ Formar parte de las decisiones del partido.</p>
                    <p>✓ Participar en charlas y capacitaciones exclusivas.</p>
                    <p>✓ Colaborar activamente en la fiscalización y defensa del voto.</p>
                    <p>✓ Ser la voz de la libertad en tu barrio.</p>
                </CardContent>
            </Card>
            {pageData.featuredImage && (
                <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                    <Image src={pageData.featuredImage} alt="Militantes y simpatizantes unidos" layout="fill" objectFit="cover" data-ai-hint="community people" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                      {pageData.featuredImageTitle && (
                        <h3 className="font-headline text-3xl text-white font-bold text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>
                          {pageData.featuredImageTitle}
                        </h3>
                      )}
                    </div>
                </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
