
import { getNewsItems, getNewsItemById } from '@/lib/news-service';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, YoutubeIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmbedDisplay } from '@/components/EmbedDisplay';

interface NewsArticlePageProps {
  params: { id: string };
}

export const revalidate = 60; // Revalidate data every 60 seconds

// Generate static paths for all news items at build time
export async function generateStaticParams() {
  const allItems = await getNewsItems();
  return allItems.map((item) => ({
    id: item.id,
  }));
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { id } = params;
  const article = await getNewsItemById(id);

  if (!article || !article.published) {
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

          {article.embedCode ? (
            <div className="mt-8 [&>*]:mx-auto">
              <EmbedDisplay embedCode={article.embedCode} />
            </div>
          ) : (
            <>
              {article.imageUrl && !article.youtubeVideoId && (
                <div className="relative w-full h-56 sm:h-72 md:h-96 mb-8 rounded-md overflow-hidden shadow-md">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="absolute h-full w-full object-cover"
                    data-ai-hint={article.imageHint}
                    loading="eager"
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
                    <CardContent className="p-0">
                      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
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
            </>
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
