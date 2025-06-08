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
}

export function Banner({ 
  title, 
  description, 
  imageUrl, 
  imageHint, 
  ctaText, 
  ctaLink, 
  variant = 'default',
  textAlignment = 'center' 
}: BannerProps) {
  return (
    <div className={cn(
      "relative text-primary-foreground py-16 md:py-24 rounded-lg shadow-xl overflow-hidden",
      variant === 'primary-bg' ? "bg-primary" : "bg-gradient-to-r from-primary to-blue-600" // A slightly different gradient for default
    )}>
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="opacity-20"
          data-ai-hint={imageHint}
          priority
        />
      </div>
      <div className={cn(
        "container mx-auto px-4 md:px-6 relative z-10",
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
