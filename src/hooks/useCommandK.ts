// src/hooks/useCommandK.ts
"use client";

import { useState, useEffect, useCallback } from "react";

// This is a simple event emitter to allow other components to open the palette
type CommandPaletteListener = () => void;
const listeners = new Set<CommandPaletteListener>();

export const openCommandPalette = () => {
  listeners.forEach((l) => l());
};

export const useCommandK = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    const onOpen = () => setIsOpen(true);

    listeners.add(onOpen);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      listeners.delete(onOpen);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [toggle]);

  return { isOpen, setIsOpen };
};
