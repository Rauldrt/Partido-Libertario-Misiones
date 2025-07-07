"use client";

import { NewsCard } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import type { NewsCardData } from '@/lib/news-service';
import { Newspaper, CalendarDays, Megaphone, Radio, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Banner } from '@/components/Banner';
import React from 'react';

export default function NewsPageClient({ newsItems }: { newsItems: NewsCardData[] }) {
  const carouselNewsItems = newsItems.slice(0, 4); 

  return (
    <>
      <Section id="news-and-events-header" className="overflow-hidden relative">
        {/* Animated Background and Icons Container */}
        <div className="absolute inset-0 z-0">
          {/* Gradient Background */}
          <div className="h-full w-full bg-gradient-to-br from-purple-700 via-orange-500 to-yellow-400 bg-300% animate-animated-gradient" />
          
          {/* Superimposed Icons */}
          <Newspaper className="absolute top-[20%] left-[15%] h-24 w-24 text-white animate-subtle-pulse" style={{ animationDuration: '7s' }} />
          <CalendarDays className="absolute bottom-[15%] right-[20%] h-20 w-20 text-white animate-subtle-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <Megaphone className="absolute top-[55%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white animate-subtle-pulse" style={{ animationDuration: '8s', animationDelay: '0.5s' }} />
          <Radio className="absolute top-[10%] right-[10%] h-12 w-12 text-white animate-subtle-pulse" style={{ animationDuration: '6s', animationDelay: '1.5s' }} />
           <Newspaper className="absolute bottom-[10%] left-[30%] h-14 w-14 text-white animate-subtle-pulse" style={{ animationDuration: '7.5s', animationDelay: '2s' }} />
          <CalendarDays className="absolute top-[30%] right-[45%] h-10 w-10 text-white animate-subtle-pulse" style={{ animationDuration: '5.5s', animationDelay: '2.5s' }} />
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
          <div className="mt-8 flex justify-center gap-6">
            <Link href="#" aria-label="Facebook" className="text-primary-foreground/80 hover:text-accent transition-colors p-2 rounded-full hover:bg-black/20">
              <Facebook className="h-7 w-7" />
            </Link>
            <Link href="#" aria-label="Twitter" className="text-primary-foreground/80 hover:text-accent transition-colors p-2 rounded-full hover:bg-black/20">
              <Twitter className="h-7 w-7" />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-primary-foreground/80 hover:text-accent transition-colors p-2 rounded-full hover:bg-black/20">
              <Instagram className="h-7 w-7" />
            </Link>
            <Link href="#" aria-label="YouTube" className="text-primary-foreground/80 hover:text-accent transition-colors p-2 rounded-full hover:bg-black/20">
              <Youtube className="h-7 w-7" />
            </Link>
          </div>
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

        <Section id="news-list-items" className="!py-0">
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
