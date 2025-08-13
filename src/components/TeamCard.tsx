
'use client';

import { ExpandingCandidateCard } from './ExpandingCandidateCard';
import type { TeamMember } from '@/lib/dynamic-sections-service';


export function TeamCard(props: TeamMember) {
  // We can add logic here in the future if we need different card types.
  // For now, we delegate directly to the new expanding card.
  return <ExpandingCandidateCard {...props} />;
}
