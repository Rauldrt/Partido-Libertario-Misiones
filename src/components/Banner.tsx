
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';

interface Cta {
  text: string;
  link: string;
  className?: string;
  onClick?: () => void;
}

interface BannerProps {
  title: string;
  description: string;
  ctas?: Cta[];
  textAlignment?: 'center' | 'left';
  priority?: boolean;
  className?: string;
}

export function Banner({ 
  title, 
  description, 
  ctas,
  textAlignment = 'center',
  className
}: BannerProps) {
  return (
    <div className={cn(
      "relative text-primary-foreground min-h-[450px] flex flex-col justify-center p-6 md:p-8 z-10",
      textAlignment === 'center' ? 'items-center text-center' : 'items-start text-left',
      className
    )}>
      <h1 
        className="w-full font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 opacity-0 animate-fade-in-up break-words"
        style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}
      >
        {title}
      </h1>
      <p 
        className={cn(
          "w-full font-body text-base md:text-lg mb-6 md:mb-8 opacity-0 animate-fade-in-up [animation-delay:200ms] break-words",
           "md:max-w-2xl",
           textAlignment === 'center' ? 'mx-auto' : ''
        )}
        style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}
      >
        {description}
      </p>
      {ctas && ctas.length > 0 && (
          <div className={cn(
              "opacity-0 animate-fade-in-up [animation-delay:400ms] flex flex-wrap items-center gap-4",
              textAlignment === 'center' ? 'justify-center' : 'justify-start'
          )}>
          {ctas.map((cta, index) => (
            <Button 
              key={index} 
              asChild 
              size="lg" 
              className={cn(
                "shadow-md transition-transform hover:scale-105", 
                cta.className
              )}
              onClick={cta.onClick}
            >
              <Link href={cta.link}>{cta.text}</Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
