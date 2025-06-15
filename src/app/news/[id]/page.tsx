
import { mockNewsItems } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, YoutubeIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    notFound(); 
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
            {article.youtubeVideoId && (
              <>
                <span className="mx-2 font-semibold">|</span>
                <YoutubeIcon className="mr-1 h-4 w-4 text-red-600" />
                <span className="text-muted-foreground">Video Disponible</span>
              </>
            )}
          </div>

          {article.imageUrl && !article.youtubeVideoId && ( // Solo mostrar imagen si no hay video principal, o decidir si mostrar ambos
            <div className="relative w-full h-56 sm:h-72 md:h-96 mb-8 rounded-md overflow-hidden shadow-md">
              <Image
                src={article.imageUrl}
                alt={article.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={article.imageHint}
                priority
              />
            </div>
          )}
          
          <div className="space-y-5 font-body text-base md:text-lg text-foreground/90 leading-relaxed">
            {articleContent.split('\\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : null
            ))}
          </div>

          {article.youtubeVideoId && (
            <div className="mt-8">
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="bg-muted/30 p-3">
                  <CardTitle className="font-headline text-lg flex items-center">
                    <YoutubeIcon className="mr-2 h-6 w-6 text-red-500" />
                    Video Relacionado
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0"> {/* Remove padding for aspect ratio div to work well */}
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-b-lg"
                      src={`https://www.youtube.com/embed/${article.youtubeVideoId}`}
                      title={`Video de YouTube: ${article.title}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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
