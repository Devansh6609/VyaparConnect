// src/context/ThemeContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'signature' | 'sunrise-glow' | 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (storedTheme && ['signature', 'sunrise-glow', 'light', 'dark'].includes(storedTheme)) {
            return storedTheme;
        }
    }
    return 'signature'; // Default theme
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove all possible theme classes
        root.classList.remove('light', 'dark', 'sunrise-glow');

        // Add the specific class only if it's not the default 'signature' theme
        if (theme !== 'signature') {
            root.classList.add(theme);
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            if (prevTheme === 'signature') return 'sunrise-glow';
            if (prevTheme === 'sunrise-glow') return 'light';
            if (prevTheme === 'light') return 'dark';
            return 'signature'; // cycles back to signature
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};