// src/components/SummaryModal.tsx
"use client";

import React, { Fragment } from 'react';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: string;
    isLoading: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
};


// Helper component to parse and render formatted summary lines
const LineRenderer: React.FC<{ line: string }> = ({ line }) => {
    if (line.trim() === '') {
        return <div className="h-3" />; // Represents a newline for spacing
    }

    let content = line.trim();
    let isListItem = false;

    // Check for list items (e.g., "* Customer Request:")
    if (content.startsWith('* ')) {
        isListItem = true;
        content = content.substring(2);
    }

    // Split the content by the bold marker "**" to handle highlighting
    const parts = content.split('**');

    // Check if the entire line was meant to be a heading (e.g., "**Key Points:**")
    if (parts.length === 3 && parts[0] === '' && parts[2].trim() === '') {
        return (
            <h4 className="font-semibold text-base mt-4 mb-2 text-gray-900 dark:text-gray-100">
                {parts[1]}
            </h4>
        );
    }

    // Reconstruct the line with <strong> tags for highlighting
    const renderedContent = parts.map((part, index) => {
        // Every odd-indexed part is bold
        if (index % 2 === 1) {
            return <strong key={index} className="font-semibold text-gray-800 dark:text-gray-200">{part}</strong>;
        }
        return <Fragment key={index}>{part}</Fragment>;
    });

    if (isListItem) {
        return (
            <div className="flex items-start pl-2">
                <span className="mr-2 mt-1 text-gray-500 dark:text-gray-400">•</span>
                <p className="flex-1">{renderedContent}</p>
            </div>
        );
    }

    return <p>{renderedContent}</p>;
};


const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summary, isLoading }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Conversation Summary">
            <div className="min-h-[200px] max-h-[60vh] overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Generating summary...</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                        {summary.split('\n').map((line, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <LineRenderer line={line} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t dark:border-gray-700">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default SummaryModal;