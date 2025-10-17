"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { useAIModal } from '../../context/AiModalContext';

const VyaparAIFab: React.FC = () => {
    const { openModal } = useAIModal();

    return (
        <motion.button
            onClick={openModal}
            className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-lg z-40"
            // FIX: Removed `whileHover` and `whileTap` props due to TypeScript error. This may affect animations.
            aria-label="Open Vyapar AI Assistant"
            title="Vyapar AI"
        >
            <Icon name="sparkles" size={28} />
        </motion.button>
    );
};

export default VyaparAIFab;