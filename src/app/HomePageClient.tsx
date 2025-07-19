
"use client";

import React, { type PropsWithChildren, useState, useEffect, createElement } from 'react';
import { Section } from '@/components/ui/Section';
import { Banner } from '@/components/Banner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BannerSlideData, MosaicImageData, MosaicTileData, AccordionItemData, InfoSectionData } from '@/lib/homepage-service';
import { EmbedDisplay } from '@/components/EmbedDisplay';

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


export default function HomePageClient({ children, slides, tiles, accordionItems, events, socialWidget, infoSectionData }: PropsWithChildren<{ slides: BannerSlideData[], tiles: MosaicTileData[], accordionItems: AccordionItemData[], events: React.ReactNode, socialWidget: React.ReactNode, infoSectionData: InfoSectionData }>) {
  const [lightboxData, setLightboxData] = useState<{ images: MosaicImageData[], startIndex: number } | null>(null);
  const [openAccordionItem, setOpenAccordionItem] = useState('');

  const handleBannerCtaClick = (accordionTarget?: string) => {
    if (accordionTarget) {
      setOpenAccordionItem(accordionTarget);
    }
  };

  const DynamicIcon = ({ name }: { name: string }) => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) {
      return <LucideIcons.HelpCircle className="h-10 w-10 text-primary" />; // Fallback icon
    }
    return createElement(IconComponent, { className: 'h-10 w-10 text-primary' });
  };

  return (
    <>
      <Section 
        id="hero" 
        className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center p-0"
      >
        <Carousel
            plugins={[
                Autoplay({
                    delay: 5000,
                    stopOnInteraction: true,
                }),
            ]}
            className="w-full h-full"
            opts={{
                loop: true,
            }}
        >
            <CarouselContent className="ml-0 h-full">
                {slides.map((slide, index) => {
                    return (
                        <CarouselItem key={index} className="pl-0 relative flex items-center justify-center">
                          {slide.embedCode ? (
                              <div className="w-full h-full max-h-full max-w-4xl mx-auto p-4 flex items-center justify-center">
                                  <EmbedDisplay embedCode={slide.embedCode} />
                              </div>
                          ) : (
                            <>
                              {/* Per-slide background */}
                              {slide.videoUrl ? (
                                  <video className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline>
                                      <source src={slide.videoUrl} type="video/mp4" />
                                  </video>
                              ) : slide.imageUrl ? (
                                  <Image
                                      src={slide.imageUrl}
                                      alt={slide.title}
                                      layout="fill"
                                      objectFit="cover"
                                      className="absolute z-0"
                                      priority={index === 0}
                                  />
                              ) : (
                                  // Fallback to section-wide background if slide has no media
                                  <video className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline>
                                      <source src="/background.mp4" type="video/mp4" />
                                  </video>
                              )}
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/60 z-10" />

                              {/* Banner Content */}
                              <div className="relative z-20 h-full flex items-center justify-center w-full">
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
                              </div>
                            </>
                          )}
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            <div className="absolute z-30 bottom-32 left-1/2 -translate-x-1/2 flex items-center justify-center w-full">
              <CarouselPrevious className="static translate-y-0 mx-2 bg-background/50 hover:bg-background/80 text-foreground" />
              <CarouselNext className="static translate-y-0 mx-2 bg-background/50 hover:bg-background/80 text-foreground" />
            </div>
        </Carousel>

        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 flex flex-row gap-4 w-full max-w-md px-4 sm:px-0 md:hidden">
            <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-primary-foreground hover:from-orange-600 hover:to-amber-600 shadow-lg transition-transform hover:scale-105">
              <Link href="/fiscalizacion">
                  <LucideIcons.ShieldCheck className="mr-2 h-5 w-5" />
                  <span>Fiscalizá</span>
              </Link>
            </Button>
            <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-primary-foreground hover:from-cyan-600 hover:to-purple-600 shadow-lg transition-transform hover:scale-105">
              <Link href="/afiliacion">
                  <LucideIcons.UserPlus className="mr-2 h-5 w-5" />
                  <span>Afiliate</span>
              </Link>
            </Button>
        </div>
      </Section>
      
      <Section id="info" className="py-16 md:py-24">
        <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold text-white">{infoSectionData.title}</h2>
            <p className="font-body text-lg text-white/90 mt-2">{infoSectionData.description}</p>
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
                {accordionItems.map(item => (
                    <AccordionItem key={item.id} value={item.value} className="border-b-0">
                        <Card className="shadow-lg w-full">
                            <AccordionTrigger className="p-6 hover:no-underline">
                                <div className="flex items-center gap-4 w-full">
                                    <DynamicIcon name={item.icon} />
                                    <span className="font-headline text-2xl text-foreground">{item.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <p className="font-body text-lg">
                                    {item.content}
                                </p>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                ))}
             </Accordion>

             <div className="mt-8 text-center">
                <Button asChild>
                    <Link href="/referentes">
                        <LucideIcons.Users className="mr-2 h-5 w-5" />
                        Nuestros Referentes
                    </Link>
                </Button>
            </div>
        </div>
      </Section>
      
      <Section id="latest-news" className="py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl font-bold text-white">Actividad Reciente</h2>
          <p className="font-body text-lg text-white/90 mt-2">
            Enterate de las últimas noticias, eventos y conectate con nosotros en redes sociales.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div className="col-span-1">{events}</div>
            <div className="col-span-1">
                 <Card className="shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <LucideIcons.Rss className="h-6 w-6 text-primary mr-3" />
                            Conectate en Redes
                        </CardTitle>
                        <CardDescription>
                            Seguinos para no perderte ninguna novedad.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {socialWidget}
                    </CardContent>
                </Card>
            </div>
        </div>

        {children}
      </Section>

      <Section id="contact-us" className="pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <Accordion 
              type="single" 
              collapsible 
              defaultValue="contact"
              className="w-full"
            >
              <AccordionItem value="contact" className="border-b-0">
                  <Card className="shadow-lg w-full">
                      <AccordionTrigger className="p-6 hover:no-underline">
                          <div className="flex items-center gap-4 w-full">
                              <LucideIcons.MessageSquare className="h-10 w-10 text-primary" />
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
