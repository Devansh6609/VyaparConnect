// src/components/providers.tsx
"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AIModalProvider } from '../context/AiModalContext';

export function Providers({ children }: { children: React.ReactNode }) {
    // All providers are composed here to ensure a single, consistent client boundary
    // for all contexts, which resolves the runtime error.
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