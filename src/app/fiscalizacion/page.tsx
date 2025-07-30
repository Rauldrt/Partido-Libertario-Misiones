
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { getPageHeaderData } from '@/lib/page-headers-service';
import type { PageHeaderData } from '@/lib/page-headers-service';
import { DynamicIcon } from '@/components/DynamicIcon';

export default async function FiscalizacionPage() {
  const headerData = await getPageHeaderData('fiscalizacion');

  // Use default data if none is found to prevent crashing
  const pageData: PageHeaderData = headerData || {
    title: "Defendé el Voto",
    description: "La defensa de la libertad también se juega en las urnas. Tu rol como fiscal es crucial para garantizar la transparencia y el respeto a la voluntad popular. ¡Sumate al equipo de fiscales!",
    icon: "ShieldCheck",
    backgroundImage: "/banner2.jpg"
  };

  // PLEASE REPLACE THIS URL WITH YOUR GOOGLE FORM "EMBED" URL
  const googleFormUrl = "https://www.appsheet.com/start/1e3ae975-00d1-4d84-a243-f034e9174233#appName=Fiscales-753264&row=&table=Fiscales+2025&view=fiscales+2025";

  return (
    <>
      <Section 
        id="fiscalizacion-header" 
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

      <Section id="fiscalizacion-form-section" className="py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <Card className="shadow-2xl w-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl md:text-3xl">Formulario de Inscripción</CardTitle>
              <CardDescription className="font-body text-md">
                Completá tus datos para ser parte del equipo de fiscales del Partido Libertario.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="relative w-full flex-grow h-[700px] rounded-md overflow-hidden border">
                 <iframe 
                  src={googleFormUrl}
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  marginHeight={0} 
                  marginWidth={0}
                  className="absolute top-0 left-0"
                  title="Formulario de Inscripción para Fiscales"
                >
                  Cargando formulario...
                </iframe>
              </div>
               <p className="text-xs text-muted-foreground mt-2">
                <span className="font-bold">Nota:</span> Usamos un formulario para gestionar los contactos.
              </p>
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
            {pageData.featuredImage && (
              <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                  <Image src={pageData.featuredImage} alt="Personas en una mesa de votación" layout="fill" objectFit="cover" data-ai-hint="election polling station" />
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
