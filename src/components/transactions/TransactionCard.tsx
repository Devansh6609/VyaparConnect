// src/components/transactions/TransactionCard.tsx
import React from 'react';
import Link from 'next/link';
// FIX: Used type-only import with path alias to prevent module resolution errors.
import type { Transaction } from '@/types';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { Eye, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
// FIX: Using path alias for consistency and to resolve potential module resolution errors causing type issues.
import Icon from '@/components/ui/Icon';

interface TransactionCardProps {
    transaction: Transaction;
    onViewDetails: () => void;
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onViewDetails }) => {
    return (
        <div
            className="bg-white dark:bg-[var(--card-background)] p-4 rounded-lg shadow-sm border dark:border-[var(--card-border)] hover:shadow-md transition-shadow duration-200 flex flex-col"
        >
            <div className="flex-grow grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                {/* Customer & Items */}
                <div className="md:col-span-3">
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{transaction.customerName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{transaction.itemsSummary}</p>
                </div>

                {/* Value */}
                <div className="md:col-span-1 text-left md:text-right">
                    <p className="font-semibold text-lg dark:text-gray-100">₹{transaction.totalValue.toLocaleString('en-IN')}</p>
                </div>

                {/* Status */}
                <div className="md:col-span-2 flex justify-start md:justify-end">
                    <StatusBadge status={transaction.status} />
                </div>
            </div>

            <div className="border-t dark:border-[var(--card-border)] mt-3 pt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div>
                    ID: <span className="font-mono text-xs">{transaction.id.substring(0, 8)}...</span>
                    <span className="mx-2">|</span>
                    {format(new Date(transaction.date), 'dd MMM, yyyy')}
                </div>
                <div className="flex items-center space-x-2">
                    <Link
                        href={`/chat?contactId=${transaction.contactId}`}
                        className="p-2 text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"
                        title="Chat on WhatsApp"
                    >
                        <Icon name="messageCircle" size={18} />
                    </Link>
                    <button
                        onClick={onViewDetails}
                        className="p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;