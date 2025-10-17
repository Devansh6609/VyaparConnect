"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const AIModalContext = createContext<AIModalContextType | undefined>(undefined);

export const AIModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <AIModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
        </AIModalContext.Provider>
    );
};

export const useAIModal = (): AIModalContextType => {
    const context = useContext(AIModalContext);
    if (!context) {
        throw new Error('useAIModal must be used within an AIModalProvider');
    }
    return context;
};