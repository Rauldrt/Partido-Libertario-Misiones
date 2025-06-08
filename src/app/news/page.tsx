
"use client";

import { NewsCard } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import { mockNewsItems } from '@/lib/data';
import { Newspaper, CalendarDays } from 'lucide-react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Banner } from '@/components/Banner';
import React from 'react';

export default function NewsPage() {
  const carouselNewsItems = mockNewsItems.slice(0, 4); // Tomar los primeros 4 para el carrusel

  return (
    <>
      <Section id="news-and-events-header">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
           <Newspaper className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Noticias y Eventos</h1>
          <p className="font-body text-xl text-muted-foreground mt-2">
            Mantenete al tanto de las últimas novedades y próximos encuentros del Partido Libertario de Misiones.
          </p>
        </div>
      </Section>

      {carouselNewsItems.length > 0 && (
        <div className="relative mb-12">
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
              {carouselNewsItems.map((item, index) => (
                <CarouselItem key={`carousel-news-${item.id}`}>
                  <Banner
                    title={item.title}
                    description={item.summary}
                    imageUrl={item.imageUrl}
                    imageHint={item.imageHint}
                    ctaText="Leer Más"
                    ctaLink={item.linkUrl}
                    variant="default"
                    textAlignment="left"
                    priority={index === 0}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
            <CarouselNext className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
          </Carousel>
        </div>
      )}

      <Section id="events-list" className="pt-0">
        <div className="mb-12">
          <h2 className="font-headline text-3xl font-semibold mb-6 flex items-center">
            <CalendarDays className="h-8 w-8 text-primary mr-3" />
            Próximos Eventos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockNewsItems.filter(item => item.type === 'event').map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
            {mockNewsItems.filter(item => item.type === 'event').length === 0 && (
              <p className="font-body col-span-full text-center text-muted-foreground">No hay eventos programados por el momento.</p>
            )}
          </div>
        </div>
      </Section>

      <Section id="news-list-items" className="pt-0">
        <div>
          <h2 className="font-headline text-3xl font-semibold mb-6 flex items-center">
            <Newspaper className="h-8 w-8 text-primary mr-3" />
            Últimas Noticias
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockNewsItems.filter(item => item.type === 'news').map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
            {mockNewsItems.filter(item => item.type === 'news').length === 0 && (
              <p className="font-body col-span-full text-center text-muted-foreground">No hay noticias publicadas recientemente.</p>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
