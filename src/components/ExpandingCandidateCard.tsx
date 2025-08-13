
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import type { TeamMember } from '@/lib/dynamic-sections-service';
import { cn } from '@/lib/utils';

export function ExpandingCandidateCard({ name, description, imageUrl, imageHint, role }: TeamMember) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
        className="flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
    >
        {/* Container for the expanding element */}
        <div 
            id="expandable-card"
            className={cn(
                "relative bg-card shadow-lg transition-all duration-500 ease-in-out",
                isExpanded ? 'is-expanded' : 'w-32 h-32 rounded-full overflow-hidden'
            )}
        >
            {/* Collapsed State View (Just the image) */}
             <div className={cn(
                "absolute inset-0 transition-opacity duration-300",
                isExpanded ? 'opacity-0' : 'opacity-100'
             )}>
                <Image
                    src={imageUrl}
                    alt={`Foto de ${name}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                    data-ai-hint={imageHint}
                />
            </div>

            {/* Expanded State View (Full Card) */}
            <div className={cn(
                "absolute inset-0 transition-opacity duration-300 delay-200",
                isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}>
                 <Card className="w-full h-full bg-card border-0 shadow-none flex flex-col text-center">
                    <CardHeader className="items-center p-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-md">
                             <Image
                                src={imageUrl}
                                alt={`Foto de ${name}`}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <CardTitle className="font-headline text-lg mt-2">{name}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                        <p className="font-body text-xs text-muted-foreground">{description}</p>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Role text, always visible */}
        <p className="font-body text-sm font-semibold text-center text-foreground mt-1 group-hover:text-primary transition-colors">
            {role}
        </p>
    </div>
  );
}
