'use client';

import { ReactNode } from 'react';
import { Theme } from '@/lib/content';

interface ThemeWrapperProps {
  theme: Theme;
  children: ReactNode;
}

export function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
  return (
    <div
      style={
        {
          '--primary': theme.primary,
          '--app-secondary': theme.secondary,
          '--app-accent': theme.accent,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
