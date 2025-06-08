
import { Banner } from '@/components/Banner';
import { NewsCard } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import { mockNewsItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Goal, ArrowRight, Handshake } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const carouselSlides = [
  {
    title: "Bienvenidos a Misiones Libertad",
    description: "Unite al movimiento que defiende tus libertades individuales y promueve un futuro próspero para Misiones.",
    imageUrl: "https://placehold.co/1200x600.png",
    imageHint: "flag landscape",
    ctaText: "Conocé Más",
    ctaLink: "/about",
  },
  {
    title: "Nuestras Propuestas Claras",
    description: "Descubrí cómo planeamos transformar la provincia con ideas firmes y acciones concretas.",
    imageUrl: "https://placehold.co/1200x600.png",
    imageHint: "planning discussion",
    ctaText: "Ver Propuestas",
    ctaLink: "/about#values",
  },
  {
    title: "Sumate al Cambio Real",
    description: "Tu participación es clave. Afiliate, colaborá o participá en nuestras actividades y sé protagonista.",
    imageUrl: "https://placehold.co/1200x600.png",
    imageHint: "community action",
    ctaText: "Participar Ahora",
    ctaLink: "/contact",
  },
];

export default function HomePage() {
  const latestNews = mockNewsItems.slice(0, 3);

  return (
    <div>
      <div className="relative"> {/* Wrapper for positioning controls */}
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
          <CarouselPrevious className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
          <CarouselNext className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
        </Carousel>
      </div>

      <Section id="about-snippet">
        <div className="text-center max-w-3xl mx-auto">
          <Handshake className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">Somos el Cambio que Misiones Necesita</h2>
          <p className="font-body text-lg text-muted-foreground mb-8">
            Creemos en el poder del individuo, la libre empresa y un gobierno limitado. Nuestro compromiso es con la transparencia, la responsabilidad y la construcción de una sociedad más justa y libre para todos los misioneros.
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/about">Nuestra Propuesta <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </Section>

      <Section id="latest-news" className="bg-card">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Últimas Noticias y Eventos</h2>
          <p className="font-body text-lg text-muted-foreground mt-2">Mantenete informado sobre nuestras actividades y comunicados.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/news">Ver Todas las Noticias <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </Section>

      <Section id="join-us">
         <div className="bg-accent text-accent-foreground p-8 md:p-12 rounded-lg shadow-lg text-center">
            <Users className="h-16 w-16 mx-auto mb-6" />
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Sumate a la Libertad</h2>
            <p className="font-body text-lg mb-8 max-w-xl mx-auto">
              Tu participación es fundamental para construir el futuro que queremos. Afiliate, colaborá o participá en nuestras actividades.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">Participar Ahora <Goal className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
      </Section>
    </div>
  );
}
