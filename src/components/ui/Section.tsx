import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends PropsWithChildren {
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 md:py-16 lg:py-20', className)}>
      <div className="container mx-auto px-4 md:px-6">
        {children}
      </div>
    </section>
  );
}
