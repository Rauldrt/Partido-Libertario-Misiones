import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends PropsWithChildren {
  className?: string; // For the <section> element itself
  containerClassName?: string; // For the inner <div class="container...">
  id?: string;
  backgroundImage?: string;
  parallax?: boolean;
  backgroundOverlay?: string; // e.g. 'bg-black/50' for a dark overlay
}

export function Section({ 
  children, 
  className, 
  containerClassName,
  id, 
  backgroundImage, 
  parallax,
  backgroundOverlay
}: SectionProps) {
  const sectionStyle: React.CSSProperties = backgroundImage 
    ? { '--bg-image': `url(${backgroundImage})` } as React.CSSProperties
    : {};

  return (
    <section 
      id={id} 
      className={cn(
        'relative py-12 md:py-16 lg:py-20', // Base styles
        backgroundImage && 'bg-[image:var(--bg-image)] bg-center bg-no-repeat', // Apply image using CSS var
        parallax && 'bg-fixed', // Apply parallax if enabled
        className
      )}
      style={sectionStyle}
    >
      {backgroundImage && backgroundOverlay && (
        <div className={cn("absolute inset-0 z-0", backgroundOverlay)} />
      )}
      <div className={cn('container mx-auto px-4 md:px-6 relative z-10', containerClassName)}> {/* Content needs to be above overlay */}
        {children}
      </div>
    </section>
  );
}
