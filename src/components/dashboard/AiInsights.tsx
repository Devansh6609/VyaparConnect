
// src/components/dashboard/AiInsights.tsx
"use client";

import React, { Fragment } from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface AiInsightsProps {
    summary?: string;
}

const LineRenderer: React.FC<{ line: string }> = ({ line }) => {
    if (line.trim() === '') {
        return <div className="h-2" />; // Represents a newline for spacing
    }
    let content = line.trim();

    // Handle headings
    if (content.startsWith('### ')) {
        content = content.substring(4);
        return (
            <h4 className="font-semibold text-sm mt-3 mb-1 text-gray-800 dark:text-gray-100">
                {content}
            </h4>
        );
    }

    let isListItem = false;
    if (content.startsWith('* ')) {
        isListItem = true;
        content = content.substring(2);
    }
    const parts = content.split('**');

    const renderedContent = parts.map((part, index) => (
        index % 2 === 1
            ? <strong key={index} className="font-semibold text-gray-900 dark:text-gray-100">{part}</strong>
            : <Fragment key={index}>{part}</Fragment>
    ));

    if (isListItem) {
        return (
            <div className="flex items-start pl-2">
                <span className="mr-2 mt-1 text-blue-500">•</span>
                <p className="flex-1">{renderedContent}</p>
            </div>
        );
    }
    return <p>{renderedContent}</p>;
};


const AiInsights: React.FC<AiInsightsProps> = ({ summary }) => {
    if (!summary) {
        return null;
    }

    return (
        <motion.div
            className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/40 border border-blue-200 dark:border-blue-800/50 shadow-sm"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
            <div className="flex items-center mb-3">
                <Icon name="sparkles" className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-2">AI-Powered Insights</h3>
            </div>
            {/* Added max-height and scrollbar styles */}
            <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                <motion.div
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-1"
                >
                    {summary.split('\n').map((line, index) => (
                        <motion.div key={index}>
                            <LineRenderer line={line} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AiInsights;