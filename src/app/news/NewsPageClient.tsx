
"use client";

import { NewsCard } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import type { NewsCardData } from '@/lib/news-service';
import * as LucideIcons from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Banner } from '@/components/Banner';
import React from 'react';
import { SocialWidget } from '@/components/SocialWidget';
import type { PageHeaderData } from '@/lib/page-headers-service';
import { createElement } from 'react';

export default function NewsPageClient({ newsItems, headerData }: { newsItems: NewsCardData[], headerData: PageHeaderData }) {
  const carouselNewsItems = newsItems.slice(0, 4);

  const DynamicIcon = ({ name }: { name: string }) => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) {
      return <LucideIcons.HelpCircle className="h-12 w-12 text-accent" />; // Fallback icon
    }
    return createElement(IconComponent, { className: 'h-12 w-12 text-accent' });
  };
  
  return (
    <>
      <Section 
        id="news-and-events-header" 
        className="overflow-hidden relative"
        backgroundImage={headerData.backgroundImage}
        backgroundOverlay="bg-black/60"
        parallax={true}
      >
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center p-3 rounded-full mb-4">
           <DynamicIcon name={headerData.icon} />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary-foreground">{headerData.title}</h1>
          <p className="font-body text-xl text-primary-foreground/90 mt-2 max-w-3xl mx-auto">
            {headerData.description}
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
              <LucideIcons.CalendarDays className="h-8 w-8 text-primary mr-3" />
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
                <LucideIcons.Rss className="h-8 w-8 text-primary mr-3" />
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
              <LucideIcons.Newspaper className="h-8 w-8 text-primary mr-3" />
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
