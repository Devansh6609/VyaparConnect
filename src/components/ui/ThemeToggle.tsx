// src/components/ui/ThemeToggle.tsx
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Palette, Sunrise } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const renderThemeOption = () => {
        switch (theme) {
            case 'signature':
                return {
                    icon: <Sunrise className="mr-2 h-4 w-4" />,
                    label: 'Sunrise Glow',
                    aria: 'Switch to Sunrise Glow theme'
                };
            case 'sunrise-glow':
                return {
                    icon: <Sun className="mr-2 h-4 w-4" />,
                    label: 'Light Mode',
                    aria: 'Switch to light mode'
                };
            case 'light':
                return {
                    icon: <Moon className="mr-2 h-4 w-4" />,
                    label: 'Dark Mode',
                    aria: 'Switch to dark mode'
                };
            case 'dark':
            default:
                return {
                    icon: <Palette className="mr-2 h-4 w-4" />,
                    label: 'Signature',
                    aria: 'Switch to signature mode'
                };
        }
    };

    const currentThemeOption = renderThemeOption();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-full px-4 py-2 border rounded-md text-sm font-medium transition-colors bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            aria-label={currentThemeOption.aria}
        >
            {currentThemeOption.icon}
            <span>{currentThemeOption.label}</span>
        </button>
    );
};

export default ThemeToggle;