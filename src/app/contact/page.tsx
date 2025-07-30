
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { getPageHeaderData } from '@/lib/page-headers-service';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function ContactPage() {
  const headerData = await getPageHeaderData('contact');
  if (!headerData) {
    notFound();
  }

  // POR FAVOR, REEMPLAZA ESTA URL CON LA URL "INSERTAR" (EMBED) DE TU FORMULARIO DE GOOGLE
  const googleFormUrl = "https://www.appsheet.com/start/1e3ae975-00d1-4d84-a243-f034e9174233#appName=Fiscales-753264&row=&table=Msj+web&view=Msj+web_Form+2"; // URL de ejemplo

  return (
    <>
      <Section 
        id="contact-header"
        backgroundImage={headerData.backgroundImage}
        backgroundOverlay="bg-black/60"
        parallax={true}
        className="pt-20 pb-10 bg-cover"
      >
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold">{headerData.title}</h1>
          <p className="font-body text-xl text-muted-foreground mt-2">
            {headerData.description}
          </p>
        </div>
      </Section>

      <Section id="contact-content" className="py-10">
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <Card className="shadow-xl flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Envianos un Mensaje</CardTitle>
              <CardDescription className="font-body text-md">
                Por favor, completá el siguiente formulario para contactarnos.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="relative w-full flex-grow h-[600px] rounded-md overflow-hidden border">
                <iframe
                  src={googleFormUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  className="absolute top-0 left-0"
                  title="Formulario de Contacto de Google"
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
                <CardTitle className="font-headline text-2xl">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-headline text-lg font-semibold">Nuestra Sede</h3>
                    <p className="font-body text-muted-foreground">Calle 123, Posadas, Misiones</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-headline text-lg font-semibold">Correo Electrónico</h3>
                    <p className="font-body text-muted-foreground">info@misioneslibertad.com.ar</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-headline text-lg font-semibold">Teléfono</h3>
                    <p className="font-body text-muted-foreground">(0376) 4XXXXXX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {headerData.featuredImage && (
                <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                    <Image src={headerData.featuredImage} alt="Imagen destacada de contacto" layout="fill" objectFit="cover" data-ai-hint="contact us team" />
                </div>
            )}

            <Card className="shadow-lg">
               <CardHeader>
                <CardTitle className="font-headline text-2xl">Horarios de Atención</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-muted-foreground">Lunes a Viernes: 9:00 - 18:00 hs</p>
                <p className="font-body text-muted-foreground">Sábados: 9:00 - 13:00 hs (Consultar previamente)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
