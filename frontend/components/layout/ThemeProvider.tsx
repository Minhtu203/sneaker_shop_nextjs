'use client';
import { ThemeProvider as Theme } from 'next-themes';
import React from 'react';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Theme attribute="class" defaultTheme="system" enableSystem>
      {children}
    </Theme>
  );
}

export default ThemeProvider;
