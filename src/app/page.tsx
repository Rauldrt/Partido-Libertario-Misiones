
"use client";

import Image from 'next/image';
import { Banner } from '@/components/Banner';
import { NewsCard } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import { mockNewsItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Goal, ArrowRight, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContactForm } from '@/components/ContactForm';

const carouselSlides = [
  {
    title: "Partido Libertario Misiones",
    description: "Unite al movimiento que defiende tus libertades individuales y promueve un futuro próspero para Misiones.",
    ctaText: "Conocé Más",
    ctaLink: "/about",
  },
  {
    title: "Nuestras Propuestas Claras",
    description: "Descubrí cómo planeamos transformar la provincia con ideas firmes y acciones concretas.",
    ctaText: "Ver Propuestas",
    ctaLink: "/about#values",
  },
  {
    title: "Sumate al Cambio Real",
    description: "Tu participación es clave. Afiliate, colaborá o participá en nuestras actividades y sé protagonista.",
    ctaText: "Participar Ahora",
    ctaLink: "/contact",
  },
];

const somosElCambioCarouselImages = [
  { src: '/afilia1.webp', alt: 'Grupo de personas unidas', hint: 'community people', width: 800, height: 533 },
  { src: '/banner1.jpg', alt: 'Formulario de Afiliación simbólico', hint: 'affiliation form', width: 720, height: 480 },
  { src: '/grupo.webp', alt: 'Paisaje Misionero', hint: 'Misiones landscape', width: 600, height: 400 },
  { src: '/banner2.jpg', alt: 'Debate de ideas constructivo', hint: 'ideas debate', width: 800, height: 600 },
];


export default function HomePage() {
  const latestNews = mockNewsItems.slice(0, 3);

  return (
    <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 pb-8 md:pb-12">
      <Section
        id="banner-carousel"
        className="py-0 bg-gradient-to-r from-purple-800 to-orange-500 bg-300% animate-animated-gradient"
        containerClassName="px-0 md:px-0 max-w-full"
      >
        <div className="relative container mx-auto px-4 md:px-6">
          <Carousel
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {carouselSlides.map((slide, index) => (
                <CarouselItem key={index}>
                  <Banner
                    title={slide.title}
                    description={slide.description}
                    ctaText={slide.ctaText}
                    ctaLink={slide.ctaLink}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
            <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
          </Carousel>
        </div>
      </Section>

      <Section id="about-snippet-card" className="py-0">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="p-0">
            <div className="relative w-full h-[200px] md:h-[250px] group overflow-hidden">
              {somosElCambioCarouselImages.length > 0 ? (
                <Carousel
                  className="w-full h-full"
                  opts={{ loop: true }}
                  plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
                >
                  <CarouselContent className="h-full">
                    {somosElCambioCarouselImages.map((img, index) => (
                      <CarouselItem key={index} className="h-full">
                        <Image 
                          src={img.src} 
                          alt={img.alt}
                          width={img.width}
                          height={img.height}
                          className="w-full h-full object-cover"
                          data-ai-hint={img.hint} 
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/90 text-foreground h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/90 text-foreground h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Carousel>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p className="text-muted-foreground">No images to display.</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl mb-6">
              Somos el Cambio que Misiones Necesita
            </CardTitle>
            <p className="font-body text-lg text-foreground/90">
              Creemos en el poder del individuo, la libre empresa y un gobierno limitado. Nuestro compromiso es con la transparencia, la responsabilidad y la construcción de una sociedad más justa y libre para todos los misioneros.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center p-6 bg-muted/30">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/about">Nuestra Propuesta <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <Section id="latest-news" className="py-0">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary-foreground">Últimas Noticias y Eventos</h2>
          <p className="font-body text-lg text-primary-foreground/80 mt-2">Mantenete informado sobre nuestras actividades y comunicados.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
            <Link href="/news">Ver Todas las Noticias <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </Section>

      <Section id="join-us-card" className="py-0">
         <Card className="max-w-3xl mx-auto shadow-xl">
            <CardHeader className="bg-primary p-6">
                <div className="flex flex-col items-center text-center">
                    <Users className="h-16 w-16 mx-auto mb-4 text-accent" />
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary-foreground">Sumate a la Libertad</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <p className="font-body text-lg mb-8 text-foreground/90 text-center">
                Tu participación es fundamental para construir el futuro que queremos. Afiliate, colaborá o participá en nuestras actividades.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="contact-details" className="border-0">
                    <AccordionTrigger className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-md p-3 text-lg font-medium flex justify-center items-center hover:no-underline">
                       <MessageSquare className="mr-2 h-6 w-6" /> Contactanos / Participá Ahora
                    </AccordionTrigger>
                    <AccordionContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-10 items-start">
                        <div className="space-y-4">
                          <h3 className="font-headline text-2xl font-semibold text-primary">Envianos un Mensaje</h3>
                          <ContactForm />
                        </div>
                        <div className="space-y-6">
                          <h3 className="font-headline text-2xl font-semibold text-primary">Información Adicional</h3>
                          <div className="flex items-start">
                            <MapPin className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-headline text-lg font-semibold">Nuestra Sede</h4>
                              <p className="font-body text-muted-foreground">Calle Falsa 123, Posadas, Misiones</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Mail className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-headline text-lg font-semibold">Correo Electrónico</h4>
                              <p className="font-body text-muted-foreground">info@misioneslibertad.com.ar</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Phone className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-headline text-lg font-semibold">Teléfono</h4>
                              <p className="font-body text-muted-foreground">(0376) 4XXXXXX</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-headline text-lg font-semibold">Horarios de Atención</h4>
                            <p className="font-body text-muted-foreground">Lunes a Viernes: 9:00 - 18:00 hs</p>
                            <p className="font-body text-muted-foreground">Sábados: 9:00 - 13:00 hs (Consultar previamente)</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardContent>
         </Card>
      </Section>
    </div>
  );
}
