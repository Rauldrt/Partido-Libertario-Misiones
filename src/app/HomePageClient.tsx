
"use client";

import React, { type PropsWithChildren } from 'react';
import { Section } from '@/components/ui/Section';
import { Banner } from '@/components/Banner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Goal, Eye, Heart, MessageSquare, Users, CheckCircle, ShieldCheck, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const values = [
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: 'Libertad Individual',
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: 'Propiedad Privada',
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
    title: 'Libre Mercado',
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: 'Gobierno Limitado',
  },
];

// PLEASE REPLACE THIS URL WITH YOUR GOOGLE FORM "EMBED" URL
const googleFormUrl = "https://www.appsheet.com/start/1e3ae975-00d1-4d84-a243-f034e9174233#appName=Fiscales-753264&row=&table=Msj+web&view=Msj+web_Form+2";

const carouselSlides = [
    {
        title: "Nuestra Misión",
        description: "Promover y defender los principios de una sociedad libre, impulsando políticas que garanticen los derechos individuales, la propiedad privada, el libre mercado y un gobierno limitado.",
        cta: { text: "Conocer Más", link: "#info" }
    },
    {
        title: "Nuestra Visión",
        description: "Ser la fuerza política que lidere la transformación hacia una provincia donde la libertad sea el motor del progreso, la innovación y la calidad de vida.",
        cta: { text: "Ver Detalles", link: "#info" }
    },
    {
        title: "Nuestros Valores",
        description: "Creemos en la Libertad Individual, la Propiedad Privada, el Libre Mercado y un Gobierno Limitado como pilares para la prosperidad.",
        cta: { text: "Explorar Principios", link: "#info" }
    },
    {
        title: "Últimas Noticias",
        description: "Mantenete al día con nuestras actividades, comunicados y los próximos eventos en Misiones.",
        cta: { text: "Ir a Noticias", link: "#latest-news" }
    }
];


export default function HomePageClient({ children }: PropsWithChildren) {
  return (
    <>
      <Section 
        id="hero" 
        className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center p-0"
        videoSrc="/banner.mp4"
        parallax={true}
        backgroundOverlay="bg-black/60"
      >
        <Carousel
            plugins={[
                Autoplay({
                    delay: 5000,
                    stopOnInteraction: true,
                }),
            ]}
            className="w-5/6 max-w-5xl mx-auto"
            opts={{
                loop: true,
            }}
        >
            <CarouselContent className="ml-0">
                {carouselSlides.map((slide, index) => (
                    <CarouselItem key={index} className="pl-0">
                        <Banner
                            title={slide.title}
                            description={slide.description}
                            ctas={[{ text: slide.cta.text, link: slide.cta.link, className: 'bg-primary text-primary-foreground hover:bg-primary/90' }]}
                            textAlignment="center"
                            priority={index === 0}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
            <CarouselNext className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
        </Carousel>
      </Section>
      
      <Section id="info" className="py-16 md:py-24">
        <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold">El Camino de la Libertad</h2>
            <p className="font-body text-lg text-muted-foreground mt-2">Nuestros principios y cómo podés participar.</p>
        </div>

        <div className="max-w-4xl mx-auto h-[600px] overflow-hidden">
             <Accordion type="single" collapsible defaultValue='mission' className="w-full space-y-4">
                 <AccordionItem value="mission" className="border-b-0">
                     <Card className="shadow-lg w-full">
                         <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="flex items-center gap-4 w-full">
                                 <Goal className="h-10 w-10 text-primary" />
                                 <span className="font-headline text-2xl text-foreground">Nuestra Misión</span>
                             </div>
                         </AccordionTrigger>
                         <AccordionContent className="px-6 pb-6">
                             <p className="font-body text-lg">
                                 Promover y defender los principios de una sociedad libre, impulsando políticas que garanticen los derechos individuales, la propiedad privada, el libre mercado y un gobierno limitado, para generar prosperidad y bienestar en Misiones.
                             </p>
                         </AccordionContent>
                     </Card>
                 </AccordionItem>

                 <AccordionItem value="vision" className="border-b-0">
                     <Card className="shadow-lg w-full">
                         <AccordionTrigger className="p-6 hover:no-underline">
                             <div className="flex items-center gap-4 w-full">
                                 <Eye className="h-10 w-10 text-primary" />
                                 <span className="font-headline text-2xl text-foreground">Nuestra Visión</span>
                             </div>
                         </AccordionTrigger>
                         <AccordionContent className="px-6 pb-6">
                             <p className="font-body text-lg">
                                 Ser la fuerza política que lidere la transformación hacia una provincia donde la libertad sea el motor del progreso, la innovación y la calidad de vida.
                             </p>
                         </AccordionContent>
                     </Card>
                 </AccordionItem>
                 
                 <AccordionItem value="values" className="border-b-0">
                    <Card className="shadow-lg w-full">
                        <AccordionTrigger className="p-6 hover:no-underline">
                            <div className="flex items-center gap-4 w-full">
                                <Heart className="h-10 w-10 text-primary" />
                                <span className="font-headline text-2xl text-foreground">Nuestros Valores</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                {values.map((value) => (
                                <div key={value.title} className="flex flex-col items-center text-center gap-2">
                                    {value.icon}
                                    <p className="font-body font-semibold">{value.title}</p>
                                </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </Card>
                 </AccordionItem>

                 <AccordionItem value="contact" className="border-b-0">
                    <Card className="shadow-lg w-full">
                        <AccordionTrigger className="p-6 hover:no-underline">
                            <div className="flex items-center gap-4 w-full">
                                <MessageSquare className="h-10 w-10 text-primary" />
                                <span className="font-headline text-2xl text-foreground">Sumate y Contactanos</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <Card className="w-full flex flex-col mt-2">
                                <CardHeader>
                                    <CardTitle className="font-headline text-xl">Envianos un Mensaje</CardTitle>
                                    <CardDescription className="font-body text-sm">
                                        Completá el formulario para contactarnos.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    <div className="relative w-full flex-grow h-[400px] rounded-md overflow-hidden border">
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
                                            Cargando...
                                        </iframe>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        <span className="font-bold">Nota:</span> Usamos un formulario de Google para gestionar los contactos.
                                    </p>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </Card>
                 </AccordionItem>
             </Accordion>
        </div>
      </Section>
      
      <Section id="latest-news" className="py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl font-bold">Últimas Noticias</h2>
          <p className="font-body text-lg text-muted-foreground mt-2">
            Mantenete al tanto de nuestras actividades y comunicados.
          </p>
        </div>
        {children}
      </Section>
    </>
  );
}
