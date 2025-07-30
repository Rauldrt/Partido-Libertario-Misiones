
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
  // Convert icon name to kebab-case to match lucide-react's dynamic import keys.
  // Example: "Users" -> "users", "ShieldCheck" -> "shield-check"
  const iconKey = name
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase();
  
  if (!(iconKey in dynamicIconImports)) {
    console.warn(`Icon "${name}" (resolved to "${iconKey}") not found in lucide-react. Falling back to HelpCircle.`);
    return <HelpCircle className={cn("h-6 w-6", className)} {...props} />;
  }

  const LucideIcon = dynamic(dynamicIconImports[iconKey as keyof typeof dynamicIconImports], {
    loading: () => <Skeleton className={cn("h-6 w-6", className)} />,
  });

  return <LucideIcon className={className} {...props} />;
};
