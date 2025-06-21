
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BannerProps {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  ctaText?: string;
  ctaLink?: string;
  variant?: 'default' | 'primary-bg';
  textAlignment?: 'center' | 'left';
  priority?: boolean;
}

export function Banner({ 
  title, 
  description, 
  imageUrl, 
  imageHint, 
  ctaText, 
  ctaLink, 
  variant = 'default',
  textAlignment = 'center',
  priority = false,
}: BannerProps) {
  return (
    <div className={cn(
      "relative text-primary-foreground py-16 md:py-24 overflow-hidden h-[400px] md:h-[500px] lg:h-[600px] flex flex-col justify-center"
    )}>
      <Image
        src={imageUrl}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
        data-ai-hint={imageHint}
        priority={priority}
      />
      <div className={cn(
        "absolute inset-0 z-10",
        variant === 'primary-bg' ? "bg-primary/40" : "bg-black/60"
      )} />
      
      <div className={cn(
        "container mx-auto px-4 md:px-6 relative z-20",
        textAlignment === 'center' ? 'text-center' : 'text-left'
      )}>
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{title}</h1>
        <p className={cn(
          "font-body text-lg md:text-xl mb-8",
          textAlignment === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
        )}>{description}</p>
        {ctaText && ctaLink && (
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md transition-transform hover:scale-105">
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
