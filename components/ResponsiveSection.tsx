'use client';

import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { ReactNode } from 'react';

interface ResponsiveSectionProps {
  mobile: ReactNode;
  desktop: ReactNode;
  breakpoint?: string;
}

/**
 * Wrapper component that conditionally renders mobile or desktop content
 * based on viewport size. Default breakpoint is 768px (tablet and below = mobile).
 */
export function ResponsiveSection({ 
  mobile, 
  desktop, 
  breakpoint = '(max-width: 768px)' 
}: ResponsiveSectionProps) {
  const isMobile = useMediaQuery(breakpoint);
  
  return <>{isMobile ? mobile : desktop}</>;
}

