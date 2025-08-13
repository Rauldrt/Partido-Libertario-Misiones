
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { TeamMember } from '@/lib/dynamic-sections-service';
import { cn } from '@/lib/utils';

export function ExpandingCandidateCard({ name, description, imageUrl, imageHint, role }: TeamMember) {

  return (
    <Card className="w-full max-w-sm overflow-hidden text-center transition-shadow duration-300 h-full flex flex-col bg-transparent border-0 shadow-none">
       <CardHeader className="p-6 items-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
                 <Image
                    src={imageUrl}
                    alt={`Foto de ${name}`}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={imageHint}
                />
            </div>
       </CardHeader>
       <CardContent className="flex-grow flex flex-col justify-start">
           <CardTitle className="font-headline text-xl text-primary">{name}</CardTitle>
           {role && (
                <CardDescription className="font-body text-base font-semibold text-muted-foreground mt-1">{role}</CardDescription>
           )}
           <p className="mt-3 font-body text-sm text-foreground/90 text-center flex-grow">
            {description}
           </p>
       </CardContent>
    </Card>
  );
}
