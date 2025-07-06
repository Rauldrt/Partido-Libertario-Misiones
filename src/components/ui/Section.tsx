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

export function Section({ 
  children, 
  className, 
  containerClassName,
  id, 
  backgroundImage, 
  videoSrc,
  parallax,
  backgroundOverlay
}: SectionProps) {
  const sectionStyle: React.CSSProperties = backgroundImage && !videoSrc
    ? { '--bg-image': `url(${backgroundImage})` } as React.CSSProperties
    : {};
  
  const hasBackground = backgroundImage || videoSrc;

  // With parallax, the section becomes a positioning context for the layers
  if (parallax) {
    return (
      <section
        id={id}
        className={cn(
          'relative parallax-wrapper', // This handles the transform-style
          backgroundImage && !videoSrc && 'bg-[image:var(--bg-image)] bg-center bg-no-repeat', // image can be here too
          className)}
        style={sectionStyle}
      >
        {videoSrc && (
          <video className="parallax-video-bg" autoPlay loop muted playsInline>
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        {hasBackground && backgroundOverlay && (
          <div className={cn("absolute inset-0 z-10", backgroundOverlay)} />
        )}
        <div className={cn('parallax-content-layer relative z-20', containerClassName)}>
          {children}
        </div>
      </section>
    );
  }

  // Non-parallax logic
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
