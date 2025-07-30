
"use client";

import dynamic from 'next/dynamic';
import { HelpCircle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, className, ...props }: DynamicIconProps) => {
  // Capitalize the first letter and make the rest lowercase, then join words
  const iconName = name
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // Convert to kebab-case to match lucide-react's dynamic import keys
  const iconKey = iconName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  
  if (!(iconKey in dynamicIconImports)) {
    return <HelpCircle className={cn("h-6 w-6", className)} {...props} />;
  }

  const LucideIcon = dynamic(dynamicIconImports[iconKey as keyof typeof dynamicIconImports], {
    loading: () => <Skeleton className={cn("h-6 w-6", className)} />,
  });

  return <LucideIcon className={className} {...props} />;
};
