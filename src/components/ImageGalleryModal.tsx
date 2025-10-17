

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
// FIX: Used type-only import to prevent module resolution errors.
import type { ProductImage } from '../types';

interface ImageGalleryModalProps {
    images: ProductImage[];
    startIndex: number;
    onClose: () => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ images, startIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [images]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
                onClick={onClose}
                aria-label="Close gallery"
            >
                <X size={32} />
            </button>

            {images.length > 1 && (
                <>
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 bg-black/20 rounded-full p-2"
                        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 bg-black/20 rounded-full p-2"
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                        aria-label="Next image"
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}

            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex].url}
                    alt={`Product image ${currentIndex + 1}`}
                    className="max-w-[90vw] max-h-[90vh] object-contain"
                    initial={{ opacity: 0.8, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking image
                />
            </AnimatePresence>

            <div className="absolute bottom-4 text-white/80 text-sm">
                {currentIndex + 1} / {images.length}
            </div>

        </motion.div>
    );
};

export default ImageGalleryModal;