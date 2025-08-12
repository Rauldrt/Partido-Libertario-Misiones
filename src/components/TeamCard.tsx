
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/dynamic-sections-service';

export function TeamCard({ name, role, description, imageUrl, imageHint }: TeamMember) {
  return (
    <Card className="group flex h-full w-full flex-col items-center overflow-hidden rounded-lg border-2 border-transparent text-center transition-all duration-300 hover:border-primary hover:shadow-2xl">
      <CardHeader className="w-full p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl}
            alt={`Foto de ${name}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-110"
            data-ai-hint={imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex w-full flex-grow flex-col justify-start p-6">
        <CardTitle className="font-headline text-xl text-primary">{name}</CardTitle>
        {role && (
          <p className="mt-1 font-semibold text-muted-foreground">{role}</p>
        )}
        <CardDescription className="mt-4 flex-grow font-body text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

