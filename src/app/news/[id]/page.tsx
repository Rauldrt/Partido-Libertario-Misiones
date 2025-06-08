
import { mockNewsItems } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { notFound } from 'next/navigation';

// Generate static paths for each news item at build time
export async function generateStaticParams() {
  return mockNewsItems.map((item) => ({
    id: item.id,
  }));
}

interface NewsArticlePageProps {
  params: { id: string };
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { id } = params;
  const article = mockNewsItems.find((item) => item.id === id);

  if (!article) {
    notFound(); // Triggers the 404 page
  }

  const articleContent = article.content || article.summary;

  return (
    <Section id={`news-article-${article.id}`} className="py-10 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" asChild className="text-sm">
            <Link href="/news" className="inline-flex items-center text-primary hover:text-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Noticias y Eventos
            </Link>
          </Button>
        </div>

        <article className="bg-card p-6 sm:p-8 rounded-lg shadow-xl">
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-primary">{article.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>{article.date}</span>
            <span className="mx-2 font-semibold">|</span>
            <span className={`capitalize font-medium px-2 py-0.5 rounded-full text-xs ${article.type === 'event' ? 'bg-accent text-accent-foreground' : 'bg-primary/10 text-primary'}`}>
              {article.type === 'news' ? 'Noticia' : 'Evento'}
            </span>
          </div>

          {article.imageUrl && (
            <div className="relative w-full h-56 sm:h-72 md:h-96 mb-8 rounded-md overflow-hidden shadow-md">
              <Image
                src={article.imageUrl}
                alt={article.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={article.imageHint}
                priority // Prioritize loading main article image
              />
            </div>
          )}
          
          <div className="space-y-5 font-body text-base md:text-lg text-foreground/90 leading-relaxed">
            {articleContent.split('\\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : null
            ))}
          </div>
        </article>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/contact">
              Sumate al Equipo
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
