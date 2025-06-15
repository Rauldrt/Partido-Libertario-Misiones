
"use client";

import { NewsCard } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import { mockNewsItems } from '@/lib/data';
import { Newspaper, CalendarDays, Megaphone, Radio } from 'lucide-react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Banner } from '@/components/Banner';
import React from 'react';

export default function NewsPage() {
  const carouselNewsItems = mockNewsItems.slice(0, 4); 

  return (
    <>
      <Section id="news-and-events-header" className="overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-gradient-to-br from-purple-700 via-orange-500 to-yellow-400 bg-300% animate-animated-gradient" />
          {/* Superimposed Icons */}
          <Newspaper className="absolute top-[20%] left-[15%] h-24 w-24 text-white animate-subtle-pulse" style={{ animationDuration: '7s' }} />
          <CalendarDays className="absolute bottom-[15%] right-[20%] h-20 w-20 text-white animate-subtle-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <Megaphone className="absolute top-[55%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white animate-subtle-pulse" style={{ animationDuration: '8s', animationDelay: '0.5s' }} />
          <Radio className="absolute top-[10%] right-[10%] h-12 w-12 text-white animate-subtle-pulse" style={{ animationDuration: '6s', animationDelay: '1.5s' }} />
           <Newspaper className="absolute bottom-[10%] left-[30%] h-14 w-14 text-white animate-subtle-pulse" style={{ animationDuration: '7.5s', animationDelay: '2s' }} />
          <CalendarDays className="absolute top-[30%] right-[45%] h-10 w-10 text-white animate-subtle-pulse" style={{ animationDuration: '5.5s', animationDelay: '2.5s' }} />
        </div>
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center bg-white/20 p-3 rounded-full mb-4 backdrop-blur-sm">
           <Newspaper className="h-12 w-12 text-accent" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary-foreground">Noticias y Eventos</h1>
          <p className="font-body text-xl text-primary-foreground/90 mt-2">
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
