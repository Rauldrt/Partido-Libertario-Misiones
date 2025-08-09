
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, Youtube, Link as LinkIcon } from 'lucide-react';
import type { NewsCardData } from '@/lib/news-service';
import { EmbedDisplay } from './EmbedDisplay';

// The NewsCardData interface has been moved to src/lib/news-service.ts
// to be shared between the component and the data service.
export type { NewsCardData };

export function NewsCard({ title, date, summary, imageUrl, imageHint, linkUrl, type, youtubeVideoId, embedCode, links }: NewsCardData) {
  
  const hasLinks = links && links.length > 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0 relative">
        {embedCode ? (
          <div className="bg-card max-h-[400px] overflow-y-auto">
            <EmbedDisplay embedCode={embedCode} />
          </div>
        ) : youtubeVideoId ? (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <img 
              src={imageUrl} 
              alt={title} 
              className="absolute h-full w-full object-cover" 
              data-ai-hint={imageHint} 
            />
            {hasLinks && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                <ul className="space-y-1">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white text-xs hover:text-primary transition-colors rounded-md p-1.5 hover:bg-white/10"
                      >
                        <LinkIcon className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-xl mb-2">{title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>{date}</span>
          </div>
          <span className="mx-2">|</span>
          <span className="capitalize font-medium text-primary">{type === 'news' ? 'Noticia' : 'Evento'}</span>
        </div>
        <CardDescription className="font-body text-base line-clamp-3">{summary}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <Button asChild variant="link" className="text-primary group p-0 h-auto">
          <Link href={linkUrl}>
            Leer Más <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <div className="flex items-center gap-1">
            {youtubeVideoId && (
              <Youtube className="h-6 w-6 text-red-600" />
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
