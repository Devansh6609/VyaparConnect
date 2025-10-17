// src/components/providers.tsx
"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AIModalProvider } from '@/context/AiModalContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                <AIModalProvider>
                    {children}
                </AIModalProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}