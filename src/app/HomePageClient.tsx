
"use client";

import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { Banner } from '@/components/Banner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Goal, Eye, Heart, MessageSquare, Users, CheckCircle, ShieldCheck, Lightbulb, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BannerSlideData, MosaicImageData, MosaicTileData } from '@/lib/homepage-service';
import { SocialWidget } from '@/components/SocialWidget';

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

const MosaicTile = ({ tile, onImageClick }: { tile: MosaicTileData, onImageClick: (images: MosaicImageData[], startIndex: number) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (tile.images.length <= 1) return;

    const slideshowInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % tile.images.length);
    }, tile.duration);

    return () => clearInterval(slideshowInterval);
  }, [tile.images, tile.duration]);

  const currentImage = tile.images[currentIndex];
  if (!currentImage) return null; // Handle case where tile has no images

  return (
    <div
      key={currentImage.src} // Key helps React re-render, triggering the animation
      className={cn(
        'group relative rounded-lg overflow-hidden shadow-lg cursor-pointer',
        tile.layout,
        tile.animation
      )}
      onClick={() => onImageClick(tile.images, currentIndex)}
    >
      <Image
        src={currentImage.src}
        alt={currentImage.alt}
        layout="fill"
        objectFit="cover"
        data-ai-hint={currentImage.hint}
        className="transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4">
        <p className="font-body text-lg font-semibold text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
          {currentImage.caption}
        </p>
      </div>
    </div>
  );
};


export default function HomePageClient({ children, slides, tiles }: PropsWithChildren<{ slides: BannerSlideData[], tiles: MosaicTileData[] }>) {
  const [lightboxData, setLightboxData] = useState<{ images: MosaicImageData[], startIndex: number } | null>(null);
  const [openAccordionItem, setOpenAccordionItem] = useState('');

  const handleBannerCtaClick = (accordionTarget?: string) => {
    if (accordionTarget) {
      setOpenAccordionItem(accordionTarget);
    }
  };

  return (
    <>
      <Section 
        id="hero" 
        className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center p-0"
        videoSrc="/background.mp4"
        parallax={true}
        backgroundOverlay="bg-black/60"
        containerClassName="w-full h-full px-4 relative flex items-center justify-center"
      >
        <Carousel
            plugins={[
                Autoplay({
                    delay: 5000,
                    stopOnInteraction: true,
                }),
            ]}
            className="w-full max-w-5xl mb-24"
            opts={{
                loop: true,
            }}
        >
            <CarouselContent className="ml-0">
                {slides.map((slide, index) => (
                    <CarouselItem key={index} className="pl-0">
                        <Banner
                            title={slide.title}
                            description={slide.description}
                            ctas={[{ 
                                text: slide.cta.text, 
                                link: slide.cta.link, 
                                className: 'bg-primary text-primary-foreground hover:bg-primary/90',
                                onClick: () => handleBannerCtaClick(slide.cta.accordionTarget) 
                            }]}
                            textAlignment="center"
                            priority={index === 0}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
        </Carousel>

        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 flex flex-row gap-4 w-full max-w-md px-4 sm:px-0 md:hidden">
            <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-primary-foreground hover:from-orange-600 hover:to-amber-600 shadow-lg transition-transform hover:scale-105">
              <Link href="/fiscalizacion">
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  <span>Fiscalizá</span>
              </Link>
            </Button>
            <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-primary-foreground hover:from-cyan-600 hover:to-purple-600 shadow-lg transition-transform hover:scale-105">
              <Link href="/afiliacion">
                  <UserPlus className="mr-2 h-5 w-5" />
                  <span>Afiliate</span>
              </Link>
            </Button>
        </div>
      </Section>
      
      <Section id="info" className="py-16 md:py-24">
        <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold text-white">El Camino de la Libertad</h2>
            <p className="font-body text-lg text-white/90 mt-2">Nuestros principios y cómo podés participar.</p>
        </div>

        <div className="max-w-5xl mx-auto mb-16 px-4">
             <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-4">
                {tiles.map((tile, index) => (
                    <MosaicTile key={index} tile={tile} onImageClick={(images, startIndex) => setLightboxData({ images, startIndex })} />
                ))}
            </div>
        </div>

        <div id="accordion-info" className="max-w-4xl mx-auto">
             <Accordion 
                type="single" 
                collapsible 
                value={openAccordionItem} 
                onValueChange={(value) => setOpenAccordionItem(value || '')} 
                className="w-full space-y-4"
              >
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
          <h2 className="font-headline text-4xl font-bold text-white">Últimas Noticias</h2>
          <p className="font-body text-lg text-white/90 mt-2">
            Mantenete al tanto de nuestras actividades y comunicados.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
            <SocialWidget />
        </div>

        {children}
      </Section>

      <Dialog open={!!lightboxData} onOpenChange={(isOpen) => !isOpen && setLightboxData(null)}>
        <DialogContent className="max-w-5xl w-full p-2 bg-transparent border-0 shadow-none">
          {lightboxData && (
            <Carousel
                opts={{
                    loop: lightboxData.images.length > 1,
                    startIndex: lightboxData.startIndex,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {lightboxData.images.map((image, index) => (
                        <CarouselItem key={index}>
                           <div className="flex items-center justify-center h-full">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={1200}
                                    height={800}
                                    className="rounded-lg object-contain w-full h-auto max-h-[90vh]"
                                    data-ai-hint={image.hint}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                 {lightboxData.images.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
                    </>
                 )}
            </Carousel>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
