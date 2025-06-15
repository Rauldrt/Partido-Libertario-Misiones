
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Goal, Eye, Heart, Activity, CheckCircle, ShieldCheck, Lightbulb } from 'lucide-react';
import Image from 'next/image';

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

export default function AboutPage() {
  return (
    <>
      <Section 
        id="intro" 
        backgroundImage="https://placehold.co/1200x800.png"
        backgroundOverlay="bg-black/60"
        parallax={true}
        className="pt-20 pb-10"
      >
        <div className="text-center">
          <Users className="h-20 w-20 text-accent mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">Quiénes Somos</h1>
          <p className="font-body text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            El Partido Libertario de Misiones es un espacio de ciudadanos comprometidos con las ideas de la libertad, la república y la prosperidad. Buscamos transformar nuestra provincia a través de la defensa de los derechos individuales y la promoción de un entorno favorable para el desarrollo.
          </p>
        </div>
      </Section>

      <Section id="mission-vision" className="bg-card">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Goal className="h-10 w-10 text-primary" />
                  <CardTitle className="font-headline text-2xl">Nuestra Misión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-body text-lg">
                  Promover y defender los principios de una sociedad libre, impulsando políticas que garanticen los derechos individuales, la propiedad privada, el libre mercado y un gobierno limitado, con el fin de generar prosperidad y bienestar para todos los misioneros.
                </p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="h-10 w-10 text-primary" />
                  <CardTitle className="font-headline text-2xl">Nuestra Visión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-body text-lg">
                  Ser la fuerza política referente en Misiones que lidere la transformación hacia una provincia donde la libertad individual sea el motor del progreso, la innovación y la calidad de vida, convirtiéndonos en un ejemplo de desarrollo y oportunidades.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
      
      <Section id="image-divider">
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-xl">
          <Image src="https://placehold.co/1200x400.png" alt="Misiones Landscape" layout="fill" objectFit="cover" data-ai-hint="Misiones landscape" />
          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
            <h2 className="font-headline text-4xl text-white font-bold text-center p-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
              Un Futuro Libre para Misiones
            </h2>
          </div>
        </div>
      </Section>

      <Section id="values">
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Nuestros Valores Fundamentales</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <Card key={value.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                {value.icon}
                <CardTitle className="font-headline mt-4 text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="activities" className="bg-card">
        <div className="text-center mb-12">
          <Activity className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Nuestras Actividades</h2>
          <p className="font-body text-lg text-muted-foreground mt-2">Fomentamos la participación ciudadana y la difusión de las ideas de la libertad.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Debates y Charlas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm">Organizamos encuentros para discutir temas de actualidad y propuestas libertarias.</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Formación Política</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm">Ofrecemos talleres y cursos para capacitar a nuestros miembros y simpatizantes.</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Acción Comunitaria</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm">Participamos en iniciativas que buscan mejorar la calidad de vida en nuestra provincia.</p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
