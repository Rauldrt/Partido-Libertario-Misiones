
"use client";

import Image from 'next/image';
import { Banner } from '@/components/Banner';
import { NewsCard } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import { mockNewsItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Goal, ArrowRight } from 'lucide-react'; // Handshake removed as it's replaced by carousel
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const carouselSlides = [
  {
    title: "Partido Libertario Misiones",
    description: "Unite al movimiento que defiende tus libertades individuales y promueve un futuro próspero para Misiones.",
    imageUrl: "https://i.pinimg.com/736x/dc/3e/41/dc3e4160b4942e685a7be5f6546fb97b.jpg",
    imageHint: "flag landscape",
    ctaText: "Conocé Más",
    ctaLink: "/about",
  },
  {
    title: "Nuestras Propuestas Claras",
    description: "Descubrí cómo planeamos transformar la provincia con ideas firmes y acciones concretas.",
    imageUrl: "https://i.pinimg.com/736x/dc/3e/41/dc3e4160b4942e685a7be5f6546fb97b.jpg",
    imageHint: "planning discussion",
    ctaText: "Ver Propuestas",
    ctaLink: "/about#values",
  },
  {
    title: "Sumate al Cambio Real",
    description: "Tu participación es clave. Afiliate, colaborá o participá en nuestras actividades y sé protagonista.",
    imageUrl: "https://i.pinimg.com/736x/dc/3e/41/dc3e4160b4942e685a7be5f6546fb97b.jpg",
    imageHint: "community action",
    ctaText: "Participar Ahora",
    ctaLink: "/contact",
  },
];

const somosElCambioCarouselImages = [
  { src: '/grupo.webp', alt: 'Futuro de Misiones', hint: 'Misiones landscape future' },
  { src: 'https://placehold.co/600x300.png', alt: 'Progreso Comunitario', hint: 'community progress people' },
  { src: 'https://placehold.co/600x300.png', alt: 'Innovación y Desarrollo', hint: 'innovation technology' },
  { src: 'https://placehold.co/600x300.png', alt: 'Participación Ciudadana', hint: 'civic participation' }, // Nueva imagen añadida
];

export default function HomePage() {
  const latestNews = mockNewsItems.slice(0, 3);

  return (
    <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 py-8 md:py-12 bg-gradient-to-br from-purple-900 to-pink-300">
      <div className="relative container mx-auto px-4 md:px-6">
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
            {carouselSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <Banner
                  title={slide.title}
                  description={slide.description}
                  imageUrl={slide.imageUrl}
                  imageHint={slide.imageHint}
                  ctaText={slide.ctaText}
                  ctaLink={slide.ctaLink}
                  variant="primary-bg"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
          <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
        </Carousel>
      </div>

      <Section id="about-snippet-card" className="py-0">
        <Card className="max-w-3xl mx-auto shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 p-0">
            <div className="relative w-full h-[200px] md:h-[250px] group">
              <Carousel
                opts={{ loop: true }}
                plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
                className="w-full h-full"
              >
                <CarouselContent className="h-full">
                  {somosElCambioCarouselImages.map((img, index) => (
                    <CarouselItem key={index} className="h-full">
                      <div className="relative w-full h-full">
                        <Image 
                          src={img.src} 
                          alt={img.alt} 
                          layout="fill" 
                          objectFit="cover" 
                          data-ai-hint={img.hint} 
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/90 text-foreground h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/90 text-foreground h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Carousel>
            </div>
            <div className="p-6 text-center">
              <CardTitle className="font-headline text-3xl md:text-4xl">Somos el Cambio que Misiones Necesita</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="font-body text-lg mb-6 text-foreground/90">
              Creemos en el poder del individuo, la libre empresa y un gobierno limitado. Nuestro compromiso es con la transparencia, la responsabilidad y la construcción de una sociedad más justa y libre para todos los misioneros.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center p-6 bg-muted/30">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/about">Nuestra Propuesta <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <Section id="latest-news" className="py-0">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary-foreground">Últimas Noticias y Eventos</h2>
          <p className="font-body text-lg text-primary-foreground/80 mt-2">Mantenete informado sobre nuestras actividades y comunicados.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
            <Link href="/news">Ver Todas las Noticias <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </Section>

      <Section id="join-us-card" className="py-0">
         <Card className="max-w-3xl mx-auto shadow-xl overflow-hidden">
            <CardHeader className="bg-primary p-6">
                <div className="flex flex-col items-center text-center">
                    <Users className="h-16 w-16 mx-auto mb-4 text-accent" />
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary-foreground">Sumate a la Libertad</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-center">
                <p className="font-body text-lg mb-8 text-foreground/90">
                Tu participación es fundamental para construir el futuro que queremos. Afiliate, colaborá o participá en nuestras actividades.
                </p>
            </CardContent>
            <CardFooter className="flex justify-center p-6 bg-muted/30">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/contact">Participar Ahora <Goal className="ml-2 h-5 w-5" /></Link>
                </Button>
            </CardFooter>
         </Card>
      </Section>
    </div>
  );
}
