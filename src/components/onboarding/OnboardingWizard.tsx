// src/components/onboarding/OnboardingWizard.tsx
"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

import Icon from '../ui/Icon';
// FIX: Replaced import from @prisma/client with a local type definition to resolve build errors.
type WorkflowType = 'QUOTATION_FOCUSED' | 'ORDER_FOCUSED' | 'HYBRID';
import LoadingSpinner from '../ui/LoadingSpinner';

const wizardVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const optionsContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};

const optionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const OnboardingWizard: React.FC = () => {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState<WorkflowType | null>(null);
    const [error, setError] = useState('');

    const handleSelectWorkflow = async (workflowType: WorkflowType) => {
        setIsLoading(workflowType);
        setError('');
        try {
            const res = await fetch('/api/user/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workflowType }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save preference.');
            }

            // Reload the page to apply the new session state and show the dashboard
            window.location.reload();

        } catch (err: any) {
            setError(err.message);
            setIsLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex items-center justify-center">
            <div className="text-center p-8 max-w-4xl mx-auto">
                <motion.div
                    variants={wizardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                        Welcome, {session?.user?.name}!
                    </h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                        Let's personalize your workspace. How do you primarily run your business?
                    </p>
                </motion.div>

                {error && <p className="mt-4 text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

                {isLoading ? <LoadingSpinner /> : (
                    <motion.div
                        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
                        variants={optionsContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.button
                            onClick={() => handleSelectWorkflow('QUOTATION_FOCUSED')}
                            variants={optionVariants}
                            whileHover={{ y: -5 }}
                            className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 hover:shadow-lg hover:border-blue-500 transition-all text-left"
                        >
                            <Icon name="FileText" size={32} className="text-green-500" />
                            <h3 className="mt-4 font-bold text-lg">Quotations First</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                I sell custom goods or high-value services and need to send estimates.
                            </p>
                        </motion.button>

                        <motion.button
                            onClick={() => handleSelectWorkflow('ORDER_FOCUSED')}
                            variants={optionVariants}
                            whileHover={{ y: -5 }}
                            className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 hover:shadow-lg hover:border-blue-500 transition-all text-left"
                        >
                            <Icon name="Package" size={32} className="text-orange-500" />
                            <h3 className="mt-4 font-bold text-lg">Orders First</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                I sell standard products at fixed prices, like food items or small goods.
                            </p>
                        </motion.button>

                        <motion.button
                            onClick={() => handleSelectWorkflow('HYBRID')}
                            variants={optionVariants}
                            whileHover={{ y: -5 }}
                            className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 hover:shadow-lg hover:border-blue-500 transition-all text-left"
                        >
                            <Icon name="Combine" size={32} className="text-purple-500" />
                            <h3 className="mt-4 font-bold text-lg">Hybrid Model</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                I do a mix of both! Show me both Quotations and Orders with equal importance.
                            </p>
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default OnboardingWizard;