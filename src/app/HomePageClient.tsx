
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
import { DynamicIcon } from '@/components/DynamicIcon';
import type { NotificationData } from '@/lib/notification-service';
import type { TeamMember } from '@/lib/dynamic-sections-service';
import { TeamCard } from '@/components/TeamCard';

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
      key={tile.id} 
      className={cn(
        'group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer',
        tile.layout
      )}
      onClick={() => onImageClick(tile.images, currentIndex)}
    >
      <div 
        key={currentImage.src}
        className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            tile.animation
        )}
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
    </div>
  );
};


export default function HomePageClient({ children, slides, tiles, accordionItems, events, socialWidget, infoSectionData, notificationData, candidates, organization }: PropsWithChildren<{ slides: BannerSlideData[], tiles: MosaicTileData[], accordionItems: AccordionItemData[], events: React.ReactNode, socialWidget: React.ReactNode, infoSectionData: InfoSectionData, notificationData: NotificationData, candidates: TeamMember[], organization: TeamMember[] }>) {
  const [lightboxData, setLightboxData] = useState<{ images: MosaicImageData[], startIndex: number } | null>(null);
  const [openAccordionItem, setOpenAccordionItem] = useState('');
  const [notificationClicked, setNotificationClicked] = useState(false);

  useEffect(() => {
    // Check session storage to see if the notification has already been clicked
    if (sessionStorage.getItem('notificationClicked') === 'true') {
      setNotificationClicked(true);
    }
  }, []);

  const handleNotificationClick = () => {
    setNotificationClicked(true);
    sessionStorage.setItem('notificationClicked', 'true');
  };

  const handleBannerCtaClick = (accordionTarget?: string) => {
    if (accordionTarget) {
      setOpenAccordionItem(accordionTarget);
      
      const element = document.getElementById('accordion-info');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <Section 
        id="hero" 
        videoSrc="/background.mp4"
        backgroundOverlay="bg-black/60"
        className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-start md:items-center justify-center p-0 pt-16 md:pt-0"
      >
        {notificationData.enabled && notificationData.text && (
          <Link href={notificationData.link || '#'} className="absolute top-4 right-4 z-40" onClick={handleNotificationClick}>
              <div className={cn(
                  "relative inline-flex items-center rounded-lg bg-background/90 p-2 pr-3 shadow-lg border border-accent/50 cursor-pointer",
                  !notificationClicked && "animate-pulse-bubble"
              )}>
                  <span className="relative flex h-3 w-3 mr-2">
                      <span className={cn("absolute inline-flex h-full w-full rounded-full bg-primary opacity-75", !notificationClicked && "animate-ping")}></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="text-sm font-medium text-foreground">{notificationData.text}</span>
              </div>
          </Link>
        )}

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
                              <div className="w-full h-[80%] max-h-[600px] max-w-4xl mx-auto p-4 flex items-center justify-center">
                                <div className="w-full h-full border rounded-lg border-white/20 bg-black/20 backdrop-blur-sm p-1 overflow-hidden">
                                  <EmbedDisplay embedCode={slide.embedCode} />
                                </div>
                              </div>
                          ) : (
                              <div className="relative z-20 h-full flex items-center justify-center w-full">
                                  <Banner
                                      title={slide.title}
                                      description={slide.description}
                                      ctas={[{ 
                                          text: slide.cta.text, 
                                          link: slide.cta.link,
                                          onClick: () => handleBannerCtaClick(slide.cta.accordionTarget),
                                          'data-accordion-target': slide.cta.accordionTarget, 
                                          className: 'bg-primary text-primary-foreground hover:bg-primary/90',
                                      }]}
                                      textAlignment="center"
                                      priority={index === 0}
                                  />
                              </div>
                          )}
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-background/50 hover:bg-background/80 text-foreground" />
            <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-background/50 hover:bg-background/80 text-foreground" />
        </Carousel>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-row gap-4 w-full max-w-md px-4 sm:px-0 md:hidden">
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

      {candidates && candidates.length > 0 && (
          <Section id="candidates" className="py-16 md:py-24 bg-muted/20">
              <div className="text-center mb-12">
                  <h2 className="font-headline text-4xl font-bold text-foreground">Nuestros Candidatos</h2>
                  <p className="font-body text-lg text-muted-foreground mt-2">Conocé a quienes nos representan.</p>
              </div>
              <Carousel
                  opts={{
                      align: "start",
                      loop: true,
                  }}
                   plugins={[
                      Autoplay({
                          delay: 3000,
                          stopOnInteraction: true,
                      }),
                  ]}
                  className="w-full max-w-7xl mx-auto"
              >
                  <CarouselContent className="-ml-4">
                      {candidates.map((candidate) => (
                          <CarouselItem key={candidate.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
                               <div className="p-1 h-full">
                                  <TeamCard {...candidate} />
                               </div>
                          </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-[-2rem] top-1/2 -translate-y-1/2 z-10 hidden lg:flex" />
                  <CarouselNext className="absolute right-[-2rem] top-1/2 -translate-y-1/2 z-10 hidden lg:flex" />
              </Carousel>
          </Section>
      )}

      {organization && organization.length > 0 && (
          <Section id="organization" className="py-16 md:py-24">
              <div className="text-center mb-12">
                  <h2 className="font-headline text-4xl font-bold text-foreground">Organigrama del Partido</h2>
                  <p className="font-body text-lg text-muted-foreground mt-2">El equipo que trabaja por la libertad en Misiones.</p>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
                  {organization.map(member => (
                      <TeamCard key={member.id} {...member} />
                  ))}
              </div>
          </Section>
      )}
      
      <Section id="info" className="py-16 md:py-24">
        <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold text-foreground">{infoSectionData.title}</h2>
            <p className="font-body text-lg text-muted-foreground mt-2">{infoSectionData.description}</p>
        </div>

        <div className="max-w-5xl mx-auto mb-16 px-4">
             <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-4">
                {tiles.map((tile) => (
                    <MosaicTile key={tile.id} tile={tile} onImageClick={(images, startIndex) => setLightboxData({ images, startIndex })} />
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
                             <AccordionTrigger className="p-6 hover:no-underline w-full">
                                <div className="flex items-center gap-4 w-full">
                                  <DynamicIcon name={item.icon} className="h-10 w-10 text-primary" />
                                  <span className="font-headline text-2xl text-foreground">{item.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <p className="font-body text-lg pl-[56px] text-muted-foreground">
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
          <h2 className="font-headline text-4xl font-bold text-foreground">Actividad Reciente</h2>
          <p className="font-body text-lg text-muted-foreground mt-2">
            Enterate de las últimas noticias, eventos y conectate con nosotros en redes sociales.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div className="col-span-1">{events}</div>
            <div className="col-span-1">
                 <Card className="shadow-lg w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center text-foreground">
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
