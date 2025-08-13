
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/dynamic-sections-service';
import { ExpandingCandidateCard } from './ExpandingCandidateCard';

export function TeamCard(props: TeamMember) {
  // We can add logic here in the future if we need different card types.
  // For now, we delegate directly to the new expanding card.
  return <ExpandingCandidateCard {...props} />;
}
