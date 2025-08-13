
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/dynamic-sections-service';

export function ExpandingCandidateCard({ name, description, imageUrl, imageHint }: TeamMember) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={cn('expandable-card bg-card text-card-foreground', { 'is-expanded': isExpanded })}
      onClick={toggleExpand}
    >
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={`Foto de ${name}`}
          layout="fill"
          objectFit="cover"
          className={cn(
            "transition-all duration-700 ease-in-out",
            isExpanded ? 'rounded-t-2xl' : 'rounded-full'
          )}
          data-ai-hint={imageHint}
        />
        <div 
          className={cn(
            "absolute bottom-0 right-0 m-2 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg transform-gpu transition-all duration-300 ease-in-out",
            isExpanded ? 'rotate-45' : 'rotate-0'
          )}
        >
          <Plus className="h-6 w-6" />
        </div>
      </div>

      <div className={cn('expandable-card-content', { 'is-visible': isExpanded })}>
        <div className="p-4 pt-12 text-center">
            <h3 className="font-headline text-xl text-primary">{name}</h3>
            <p className="mt-2 font-body text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
