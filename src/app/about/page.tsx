
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Goal, Eye, Heart, Activity, CheckCircle, ShieldCheck, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getPageHeaderData } from '@/lib/page-headers-service';
import { notFound } from 'next/navigation';

const values = [
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Libertad Individual',
    description: 'Defendemos el derecho de cada persona a vivir su vida como elija, siempre que respete los derechos de los demás.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Propiedad Privada',
    description: 'Consideramos la propiedad privada como un pilar fundamental para el progreso y la prosperidad individual y social.',
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: 'Libre Mercado',
    description: 'Promovemos la libre competencia y la mínima intervención estatal en la economía como motores del desarrollo.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Gobierno Limitado',
    description: 'Abogamos por un estado eficiente, limitado a sus funciones esenciales, que proteja los derechos y libertades.',
  },
];

export default async function AboutPage() {
  const headerData = await getPageHeaderData('about');
  if (!headerData) {
    notFound();
  }

  return (
    <>
      <Section 
        id="intro" 
        backgroundImage="/grupo.webp"
        backgroundOverlay="bg-black/60"
        parallax={true}
        className="pt-20 pb-10 bg-cover"
      >
        <div className="text-center">
          <Users className="h-20 w-20 text-accent mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">{headerData.title}</h1>
          <p className="font-body text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            {headerData.description}
          </p>
        </div>
      </Section>

      <Section id="about-details" className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="mission" className="border-b-0">
              <Card className="shadow-lg w-full">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Goal className="h-10 w-10 text-primary" />
                    <span className="font-headline text-2xl text-foreground">Nuestra Misión</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="font-body text-lg">
                    Promover y defender los principios de una sociedad libre, impulsando políticas que garanticen los derechos individuales, la propiedad privada, el libre mercado y un gobierno limitado, con el fin de generar prosperidad y bienestar para todos los misioneros.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="vision" className="border-b-0">
              <Card className="shadow-lg w-full">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Eye className="h-10 w-10 text-primary" />
                    <span className="font-headline text-2xl text-foreground">Nuestra Visión</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="font-body text-lg">
                    Ser la fuerza política referente en Misiones que lidere la transformación hacia una provincia donde la libertad individual sea el motor del progreso, la innovación y la calidad de vida, convirtiéndonos en un ejemplo de desarrollo y oportunidades.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="values" className="border-b-0">
              <Card className="shadow-lg w-full">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Heart className="h-10 w-10 text-primary" />
                    <span className="font-headline text-2xl text-foreground">Nuestros Valores Fundamentales</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid sm:grid-cols-2 gap-6 pt-4">
                    {values.map((value) => (
                      <Card key={value.title} className="text-center shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
                        <CardHeader className="items-center pt-6">
                          {value.icon}
                          <CardTitle className="font-headline mt-3 text-xl">{value.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-6">
                          <p className="font-body text-muted-foreground">{value.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="activities" className="border-b-0">
              <Card className="shadow-lg w-full">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Activity className="h-10 w-10 text-primary" />
                    <span className="font-headline text-2xl text-foreground">Nuestras Actividades</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="font-body text-lg text-muted-foreground mt-2 mb-6 text-center">
                    Fomentamos la participación ciudadana y la difusión de las ideas de la libertad.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="shadow-md bg-card">
                      <CardHeader className="pt-6">
                        <CardTitle className="font-headline text-lg">Debates y Charlas</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-6">
                        <p className="font-body text-sm">Organizamos encuentros para discutir temas de actualidad y propuestas libertarias.</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md bg-card">
                      <CardHeader className="pt-6">
                        <CardTitle className="font-headline text-lg">Formación Política</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-6">
                        <p className="font-body text-sm">Ofrecemos talleres y cursos para capacitar a nuestros miembros y simpatizantes.</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md bg-card">
                      <CardHeader className="pt-6">
                        <CardTitle className="font-headline text-lg">Acción Comunitaria</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-6">
                        <p className="font-body text-sm">Participamos en iniciativas que buscan mejorar la calidad de vida en nuestra provincia.</p>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>
      
      <Section id="image-divider" className="py-8 md:py-12">
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-xl max-w-5xl mx-auto">
          <Image src="/grupo.webp" alt="Misiones Landscape" layout="fill" objectFit="cover" data-ai-hint="Misiones landscape" />
          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
            <h2 className="font-headline text-4xl text-white font-bold text-center p-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
              Un Futuro Libre para Misiones
            </h2>
          </div>
        </div>
      </Section>
    </>
  );
}
