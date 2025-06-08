import { NewsCard } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import { mockNewsItems } from '@/lib/data';
import { Newspaper, CalendarDays } from 'lucide-react';

export default function NewsPage() {
  return (
    <Section id="news-and-events">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
         <Newspaper className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Noticias y Eventos</h1>
        <p className="font-body text-xl text-muted-foreground mt-2">
          Mantenete al tanto de las últimas novedades y próximos encuentros del Partido Libertario de Misiones.
        </p>
      </div>

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
  );
}
