
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getPageHeaderData } from '@/lib/page-headers-service';
import { notFound } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import Image from 'next/image';

export default async function AfiliacionPage() {
  const headerData = await getPageHeaderData('afiliacion');
  if (!headerData) {
    notFound();
  }

  // POR FAVOR, REEMPLAZA ESTA URL CON LA URL "INSERTAR" (EMBED) DE TU FORMULARIO DE GOOGLE
  const googleFormUrl = "https://www.appsheet.com/start/1e3ae975-00d1-4d84-a243-f034e9174233#appName=Fiscales-753264&row=&table=afilicion+res&view=afiliate";

  return (
    <>
      <Section 
        id="afiliacion-header" 
        className="py-12 md:py-16 text-white"
        backgroundImage={headerData.backgroundImage}
        backgroundOverlay="bg-black/60"
        parallax={true}
      >
        <div className="text-center">
          <UserPlus className="h-20 w-20 text-accent mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{headerData.title}</h1>
          <p className="font-body text-xl max-w-3xl mx-auto text-primary-foreground/90">
            {headerData.description}
          </p>
        </div>
      </Section>

      <Section id="afiliacion-form-section" className="py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <Card className="shadow-2xl w-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl md:text-3xl">Formulario de Afiliación</CardTitle>
              <CardDescription className="font-body text-md">
                Por favor, completá el siguiente formulario para unirte oficialmente al Partido Libertario de Misiones.
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
                  title="Formulario de Afiliación de Google"
                >
                  Cargando formulario...
                </iframe>
              </div>
               <p className="text-xs text-muted-foreground mt-2">
                <span className="font-bold">Nota:</span> Para obtener el enlace, andá a tu Google Form, hacé clic en "Enviar", seleccioná la pestaña "&lt; &gt;" y copiá la URL del atributo <code className="bg-muted px-1 rounded-sm">src</code>.
              </p>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
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
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                 <Image src="/afilia1.webp" alt="Militantes y simpatizantes unidos" layout="fill" objectFit="cover" data-ai-hint="community people" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                     <h3 className="font-headline text-3xl text-white font-bold text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>La Libertad Avanza</h3>
                 </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
