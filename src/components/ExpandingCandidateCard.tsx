
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import type { TeamMember } from '@/lib/dynamic-sections-service';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export function ExpandingCandidateCard({ name, description, imageUrl, imageHint, role }: TeamMember) {

  return (
    <Dialog>
        <DialogTrigger asChild>
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Image
                        src={imageUrl}
                        alt={`Foto de ${name}`}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={imageHint}
                    />
                </div>
                <p className="font-body text-sm font-semibold text-center text-foreground">{role}</p>
            </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-0 border-0">
            <Card className="border-0 shadow-none">
                 <CardHeader className="p-0">
                    <div className="relative w-full aspect-square rounded-t-lg overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt={`Foto de ${name}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-center">
                    <CardTitle className="font-headline text-2xl">{name}</CardTitle>
                    {role && <CardDescription className="font-body text-lg text-primary font-semibold mt-1">{role}</CardDescription>}
                    <p className="font-body text-base text-muted-foreground mt-4">{description}</p>
                </CardContent>
            </Card>
        </DialogContent>
    </Dialog>
  );
}

