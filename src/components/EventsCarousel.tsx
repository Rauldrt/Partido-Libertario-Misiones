"use client";

import type { NewsCardData } from '@/lib/news-service';
import { NewsCard } from '@/components/NewsCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";

export function EventsCarousel({ events }: { events: NewsCardData[] }) {

  if (events.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg w-full h-full flex flex-col">
        <CardHeader>
            <CardTitle className="flex items-center">
                <CalendarDays className="h-6 w-6 text-primary mr-3" />
                Próximos Eventos
            </CardTitle>
            <CardDescription>
                Sumate a nuestros próximos encuentros y charlas.
            </CardDescription>
        </CardHeader>
        <CardContent className="px-2 flex-grow flex items-center">
             <Carousel
                plugins={[
                    Autoplay({
                        delay: 7000,
                        stopOnInteraction: true,
                    }),
                ]}
                className="w-full"
                opts={{
                    loop: events.length > 1,
                }}
            >
                <CarouselContent>
                    {events.map((event) => (
                        <CarouselItem key={event.id}>
                            <div className="p-2 h-full">
                                <NewsCard {...event} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {events.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/90 text-foreground" />
                        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/90 text-foreground" />
                    </>
                )}
            </Carousel>
        </CardContent>
    </Card>
  );
}
