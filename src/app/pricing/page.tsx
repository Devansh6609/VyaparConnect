// src/app/pricing/page.tsx
"use client";
import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Icon from '@/components/ui/Icon';

const plans = [
    {
        name: 'Starter',
        price: '999',
        description: 'For solo entrepreneurs and small businesses just getting started.',
        features: [
            '1 User Seat',
            '1,500 Conversations/Month',
            'Product Catalog',
            'Quotation & Order Management',
            'Basic Analytics',
        ],
        cta: 'Choose Starter',
    },
    {
        name: 'Growth',
        price: '2,499',
        description: 'For growing teams that need more power and AI features.',
        features: [
            '3 User Seats',
            '5,000 Conversations/Month',
            'All features in Starter, plus:',
            'VyaparAI Assistant',
            'AI Smart Replies & Summaries',
            'Broadcasts & Groups',
        ],
        cta: 'Choose Growth',
        popular: true,
    },
    {
        name: 'Pro',
        price: '5,999',
        description: 'For larger organizations that require advanced tools and scale.',
        features: [
            '10 User Seats',
            '15,000 Conversations/Month',
            'All features in Growth, plus:',
            'Advanced API Access',
            'Dedicated Support',
            'Custom Integrations',
        ],
        cta: 'Choose Pro',
    },
];

const PricingPage = () => {
    const { data: session } = useSession();
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'annually'>('monthly');
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    // This would be replaced with actual subscription logic
    const handleSubscribe = async (planName: string) => {
        setLoadingPlan(planName);
        console.log(`Subscribing to ${planName}`);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoadingPlan(null);
        // Here you would integrate with Razorpay Subscriptions
    };

    // A placeholder for the user's current plan
    const currentUserPlan = 'Growth';

    return (
        <div className="min-h-full bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Find the perfect plan</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Start for free, then grow with us. All plans include our core CRM features.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative rounded-2xl p-8 shadow-lg border transition-all duration-300 ${plan.popular ? 'bg-white dark:bg-gray-800 border-blue-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white bg-blue-600">
                                    Most Popular
                                </span>
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{plan.name}</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm text-center h-12">{plan.description}</p>
                        <p className="mt-6 text-center">
                            <span className="text-5xl font-extrabold text-gray-900 dark:text-white">₹{plan.price}</span>
                            <span className="text-base font-medium text-gray-500 dark:text-gray-400">/mo</span>
                        </p>

                        <ul className="mt-8 space-y-4 text-sm">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                    <Check className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8">
                            <button
                                onClick={() => handleSubscribe(plan.name)}
                                disabled={loadingPlan === plan.name || currentUserPlan === plan.name}
                                className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium transition-colors ${currentUserPlan === plan.name
                                        ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 cursor-default'
                                        : plan.popular
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-white dark:hover:bg-blue-900'
                                    }`}
                            >
                                {loadingPlan === plan.name ? (
                                    <Loader2 className="animate-spin" />
                                ) : currentUserPlan === plan.name ? (
                                    'Current Plan'
                                ) : (
                                    plan.cta
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>
            <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>All prices are in INR. Overage charges for conversations may apply based on your plan.</p>
                <p>Have questions? <a href="#" className="font-medium text-blue-600 hover:underline">Contact our sales team</a>.</p>
            </div>
        </div>
    );
};

export default PricingPage;
