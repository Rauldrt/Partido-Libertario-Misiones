
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import type { TeamMember } from '@/lib/dynamic-sections-service';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export function ExpandingCandidateCard({ name, description, imageUrl, imageHint, role }: TeamMember) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={cn(
          'expandable-card relative cursor-pointer shadow-lg',
          isExpanded && 'is-expanded'
        )}
        onClick={() => !isExpanded && toggleExpand()}
      >
        <Image
          src={imageUrl}
          alt={`Foto de ${name}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint={imageHint}
          className={cn(
              'rounded-full transition-all duration-500',
              isExpanded && 'rounded-t-lg rounded-b-none'
          )}
        />
        {isExpanded && (
          <>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white z-20"
                onClick={toggleExpand}
                aria-label="Cerrar"
            >
                <X className="h-5 w-5" />
            </Button>
            <div 
              className={cn(
                'card-content absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white',
                isExpanded && 'is-visible'
              )}
            >
               <CardTitle className="text-lg font-bold text-white">{name}</CardTitle>
               <CardDescription className="text-white/90">{description}</CardDescription>
            </div>
          </>
        )}
      </div>
      <p className="font-body text-sm font-semibold text-center text-foreground -mt-1">{role}</p>
    </div>
  );
}
