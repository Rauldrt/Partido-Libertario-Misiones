
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BannerProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  textAlignment?: 'center' | 'left';
}

export function Banner({ 
  title, 
  description, 
  ctaText, 
  ctaLink, 
  textAlignment = 'center',
}: BannerProps) {
  return (
    <div className={cn(
      "relative text-primary-foreground py-16 md:py-24 h-[400px] md:h-[500px] lg:h-[600px] flex flex-col justify-center",
      textAlignment === 'center' ? 'text-center' : 'text-left'
    )}>
      <h1 
        className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
        style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}
      >
        {title}
      </h1>
      <p 
        className={cn(
          "font-body text-lg md:text-xl mb-8",
          textAlignment === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
        )}
        style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}
      >
        {description}
      </p>
      {ctaText && ctaLink && (
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md transition-transform hover:scale-105">
          <Link href={ctaLink}>{ctaText}</Link>
        </Button>
      )}
    </div>
  );
}
