
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import type { TeamMember } from '@/lib/dynamic-sections-service';
import { cn } from '@/lib/utils';

export function ExpandingCandidateCard({ name, description, imageUrl, imageHint, role }: TeamMember) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div
        className={cn(
          "relative bg-card shadow-lg transition-all duration-500 ease-in-out overflow-hidden",
          isExpanded ? 'w-full max-w-sm rounded-xl border' : 'w-32 h-32 md:w-36 md:h-36 rounded-full border-0 shadow-none bg-transparent'
        )}
      >
        <div className={cn(
          "relative w-full transition-all duration-500 ease-in-out",
          isExpanded ? 'h-40 md:h-72' : 'h-full'
        )}>
          <Image
            src={imageUrl}
            alt={`Foto de ${name}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={imageHint}
            className={cn(
              "transition-all duration-500 ease-in-out",
              isExpanded ? 'rounded-t-xl' : 'rounded-full'
            )}
          />
        </div>
        {/* Contenido expandido */}
        <div className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
        )}>
          <CardHeader className="items-center text-center p-4 pt-2">
            <CardTitle className="font-headline text-lg mt-2">{name}</CardTitle>
            <CardDescription className="text-primary font-semibold">{role}</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 text-center">
            <p className="font-body text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </div>
      </div>

      {/* Texto visible solo en estado colapsado */}
       <div
        className={cn(
          "text-center transition-opacity duration-300 ease-in-out",
           isExpanded ? 'opacity-0 h-0' : 'opacity-100 h-auto'
        )}
      >
        <p className="font-body text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {name}
        </p>
         <p className="font-body text-xs text-muted-foreground">
          {role}
        </p>
      </div>
    </div>
  );
}


