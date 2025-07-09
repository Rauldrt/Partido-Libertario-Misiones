
"use client";

import { NewsCard } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import type { NewsCardData } from '@/lib/news-service';
import { Newspaper, CalendarDays, Megaphone, Radio, Rss } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Banner } from '@/components/Banner';
import React from 'react';
import { SocialWidget } from '@/components/SocialWidget';

export default function NewsPageClient({ newsItems }: { newsItems: NewsCardData[] }) {
  const carouselNewsItems = newsItems.slice(0, 4);
  
  return (
    <>
      <Section id="news-and-events-header" className="overflow-hidden relative">
        {/* Animated Background and Icons Container */}
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-gradient-to-br from-purple-700 via-orange-500 to-yellow-400" />
          <Newspaper className="absolute top-[20%] left-[15%] h-24 w-24 text-white" />
          <CalendarDays className="absolute bottom-[15%] right-[20%] h-20 w-20 text-white" />
          <Megaphone className="absolute top-[55%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white" />
          <Radio className="absolute top-[10%] right-[10%] h-12 w-12 text-white" />
           <Newspaper className="absolute bottom-[10%] left-[30%] h-14 w-14 text-white" />
          <CalendarDays className="absolute top-[30%] right-[45%] h-10 w-10 text-white" />
        </div>

        {/* Content Area */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center p-3 rounded-full mb-4">
           <Newspaper className="h-12 w-12 text-accent" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary-foreground">Noticias y Eventos</h1>
          <p className="font-body text-xl text-primary-foreground/90 mt-2 max-w-3xl mx-auto">
            Mantenete al tanto de las últimas novedades y próximos encuentros del Partido Libertario de Misiones.
          </p>
        </div>
      </Section>

      <div className="py-12">
        {carouselNewsItems.length > 0 && (
          <div className="container mx-auto px-4 md:px-6 relative mb-12">
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
                      ctas={[{
                        text: "Leer Más",
                        link: item.linkUrl,
                        className: "bg-gradient-to-r from-cyan-500 to-purple-500 text-primary-foreground hover:from-cyan-600 hover:to-purple-600"
                      }]}
                      textAlignment="left"
                      priority={index === 0}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
              <CarouselNext className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
            </Carousel>
          </div>
        )}

        <Section id="events-list" className="!py-0">
          <div className="mb-12">
            <h2 className="font-headline text-3xl font-semibold mb-6 flex items-center text-foreground">
              <CalendarDays className="h-8 w-8 text-primary mr-3" />
              Próximos Eventos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.filter(item => item.type === 'event').map((item) => (
                <NewsCard key={item.id} {...item} />
              ))}
              {newsItems.filter(item => item.type === 'event').length === 0 && (
                <p className="font-body col-span-full text-center text-muted-foreground">No hay eventos programados por el momento.</p>
              )}
            </div>
          </div>
        </Section>
        
        <Section id="social-media" className="py-12 text-center bg-card/50">
            <h2 className="font-headline text-3xl font-semibold mb-2 flex items-center justify-center text-foreground">
                <Rss className="h-8 w-8 text-primary mr-3" />
                Conectate con Nosotros
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                No te pierdas ninguna de nuestras actualizaciones y participá de la conversación en nuestras redes sociales.
            </p>
            <div className="max-w-3xl mx-auto">
              <SocialWidget />
            </div>
        </Section>

        <Section id="news-list-items" className="!pt-12 !pb-0">
          <div>
            <h2 className="font-headline text-3xl font-semibold mb-6 flex items-center text-foreground">
              <Newspaper className="h-8 w-8 text-primary mr-3" />
              Últimas Noticias
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.filter(item => item.type === 'news').map((item) => (
                <NewsCard key={item.id} {...item} />
              ))}
              {newsItems.filter(item => item.type === 'news').length === 0 && (
                <p className="font-body col-span-full text-center text-muted-foreground">No hay noticias publicadas recientemente.</p>
              )}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
