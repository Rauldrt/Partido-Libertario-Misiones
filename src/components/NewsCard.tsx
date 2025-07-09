"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, Share2, Youtube } from 'lucide-react';
import type { NewsCardData } from '@/lib/news-service';
import { EmbedDisplay } from './EmbedDisplay';
import { useToast } from '@/hooks/use-toast';

// The NewsCardData interface has been moved to src/lib/news-service.ts
// to be shared between the component and the data service.
export type { NewsCardData };

export function NewsCard({ title, date, summary, imageUrl, imageHint, linkUrl, type, youtubeVideoId, embedCode }: NewsCardData) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${linkUrl}`;
    const shareData = {
      title: title,
      text: summary,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for desktop
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "¡Enlace copiado!",
          description: "El enlace a la noticia se ha copiado en tu portapapeles.",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo copiar el enlace.",
        });
      }
    }
  };
  
  const handleAddToCalendar = () => {
    const monthMap: { [key: string]: number } = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
        'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };

    let cleanDateStr = date.toLowerCase().replace('próximo:', '').replace('hs', '').trim();
    
    let datePart: string;
    let timePart: string | null = null;

    if (cleanDateStr.includes(' - ')) {
        const parts = cleanDateStr.split(' - ');
        datePart = parts[0].trim();
        timePart = parts[1].trim();
    } else {
        datePart = cleanDateStr;
    }
    
    // Regex now handles optional comma
    const dateMatch = datePart.match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+),?\s+(\d{4})/);

    if (!dateMatch) {
      toast({ variant: "destructive", title: "Error de Fecha", description: "No se pudo interpretar la fecha del evento." });
      return;
    }
    
    const [, dayStr, monthName, yearStr] = dateMatch;
    const month = monthMap[monthName.replace(/,/g, '')];

    if (month === undefined) {
      toast({ variant: "destructive", title: "Error de Fecha", description: `Mes desconocido: ${monthName}` });
      return;
    }

    let hour = 10; // Default time at 10:00 AM
    let minute = 0;

    if (timePart) {
      const timeMatch = timePart.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10);
        minute = parseInt(timeMatch[2], 10);
      }
    }
    
    const startDate = new Date(parseInt(yearStr, 10), month, parseInt(dayStr, 10), hour, minute);
    if (isNaN(startDate.getTime())) {
        toast({ variant: "destructive", title: "Error de Fecha", description: "La fecha del evento no es válida." });
        return;
    }

    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Assume 2 hour duration

    const formatDate = (d: Date) => d.toISOString().replace(/[-:.]/g, '').slice(0, -4) + 'Z';
    
    const gCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(summary)}&location=Consultar%20ubicación`;

    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  };
  
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
          {type === 'event' ? (
              <button 
                onClick={handleAddToCalendar} 
                className="flex items-center hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm p-1 -ml-1"
                aria-label="Añadir al calendario"
              >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>{date}</span>
              </button>
          ) : (
              <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>{date}</span>
              </div>
          )}
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
            <Button onClick={handleShare} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Compartir</span>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
