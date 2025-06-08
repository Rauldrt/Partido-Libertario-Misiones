import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays } from 'lucide-react';

export interface NewsCardData {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
  imageHint: string;
  linkUrl: string;
  type: 'news' | 'event';
}

export function NewsCard({ title, date, summary, imageUrl, imageHint, linkUrl, type }: NewsCardData) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image 
            src={imageUrl} 
            alt={title} 
            layout="fill" 
            objectFit="cover" 
            className="rounded-t-lg"
            data-ai-hint={imageHint} 
          />
        </div>
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
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="link" className="text-primary group p-0 h-auto">
          <Link href={linkUrl}>
            Leer Más <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
