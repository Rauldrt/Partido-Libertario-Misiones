import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends PropsWithChildren {
  className?: string;
  containerClassName?: string;
  id?: string;
  backgroundImage?: string;
  videoSrc?: string;
  parallax?: boolean;
  backgroundOverlay?: string;
}

// NOTE: Parallax functionality has been removed to resolve a persistent CSS build error.
// The `parallax` prop is now ignored.
export function Section({ 
  children, 
  className, 
  containerClassName,
  id, 
  backgroundImage, 
  videoSrc,
  backgroundOverlay
}: SectionProps) {
  const sectionStyle: React.CSSProperties = backgroundImage && !videoSrc
    ? { '--bg-image': `url(${backgroundImage})` } as React.CSSProperties
    : {};
  
  const hasBackground = backgroundImage || videoSrc;

  return (
    <section 
      id={id} 
      className={cn(
        'relative py-12 md:py-16 lg:py-20',
        backgroundImage && !videoSrc && 'bg-[image:var(--bg-image)] bg-center bg-no-repeat',
        className
      )}
      style={sectionStyle}
    >
      {videoSrc && (
        <video className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline>
            <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      {hasBackground && backgroundOverlay && (
        <div className={cn("absolute inset-0 z-10", backgroundOverlay)} />
      )}
      <div className={cn('container mx-auto px-4 md:px-6 relative z-20', containerClassName)}>
        {children}
      </div>
    </section>
  );
}
