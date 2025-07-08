
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, Youtube } from 'lucide-react';
import type { NewsCardData } from '@/lib/news-service';
import { EmbedDisplay } from './EmbedDisplay';

// The NewsCardData interface has been moved to src/lib/news-service.ts
// to be shared between the component and the data service.
export type { NewsCardData };

export function NewsCard({ title, date, summary, imageUrl, imageHint, linkUrl, type, youtubeVideoId, embedCode }: NewsCardData) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
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
          <div className="relative aspect-video overflow-hidden rounded-t-lg"> {/* Ensure consistent aspect ratio */}
            <Image 
              src={imageUrl} 
              alt={title} 
              layout="fill" 
              objectFit="cover" 
              data-ai-hint={imageHint} 
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-xl mb-2">{title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>{date}</span>
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
        {youtubeVideoId && (
          <Youtube className="h-6 w-6 text-red-600" />
        )}
      </CardFooter>
    </Card>
  );
}
