// src/app/transactions/page.tsx
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import TransactionCard from '@/components/transactions/TransactionCard';
import TransactionDetailModal from '@/components/transactions/TransactionDetailModal';
import FilterModal from '@/components/transactions/FilterModal';
// FIX: Used type-only import with path alias to prevent module resolution errors.
import type { Transaction, QuotationStatus } from '../../types';
import Icon from '@/components/ui/Icon';
import TransactionsPageSkeleton from '../../components/skeletons/TranjectionPageSkeleton';

const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState<{ statuses: QuotationStatus[] }>({ statuses: [] });

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/transactions');
                if (!res.ok) throw new Error("Failed to load transactions.");
                const data = await res.json();
                setTransactions(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const filteredTransactions = useMemo(() => {
        if (filters.statuses.length === 0) {
            return transactions;
        }
        return transactions.filter(tx => filters.statuses.includes(tx.status));
    }, [transactions, filters]);

    const activeTransactionsCount = useMemo(() => {
        return transactions.filter(tx => tx.status !== 'PAID' && tx.status !== 'CANCELLED').length;
    }, [transactions]);


    if (loading) {
        return <TransactionsPageSkeleton />;
    }

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-transparent min-h-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mb-6"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Transaction Tracker</h1>
                    <p className="text-gray-500 mt-1">Monitor all your trading transactions and WhatsApp communications.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="bg-white border px-4 py-2 rounded-md flex items-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        <Icon name="filter" size={16} className="mr-2" /> Filter
                    </button>
                </div>
            </motion.div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-center mb-4">{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <motion.div
                    layout
                    className="lg:col-span-3 space-y-4"
                >
                    <AnimatePresence>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(tx => (
                                <TransactionCard
                                    key={tx.id}
                                    transaction={tx}
                                    onViewDetails={() => setSelectedTransactionId(tx.id)}
                                />
                            ))
                        ) : (
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16 bg-white rounded-lg border">
                                <Icon name="fileText" size={40} className="mx-auto text-gray-300" />
                                <h3 className="mt-2 text-lg font-medium text-gray-700">No Transactions Found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {filters.statuses.length > 0 ? "Try adjusting your filters." : "Create a new quotation to get started."}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                        <p className="text-5xl font-bold text-blue-600">{activeTransactionsCount}</p>
                        <p className="text-sm font-medium text-gray-600 mt-1">Active Transactions</p>
                    </div>
                </div>
            </div>

            {selectedTransactionId && (
                <TransactionDetailModal
                    quotationId={selectedTransactionId}
                    isOpen={!!selectedTransactionId}
                    onClose={() => setSelectedTransactionId(null)}
                />
            )}

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                currentFilters={filters}
                onApplyFilters={(newFilters) => {
                    setFilters(newFilters);
                    setIsFilterModalOpen(false);
                }}
            />
        </div>
    );
};

export default TransactionsPage;