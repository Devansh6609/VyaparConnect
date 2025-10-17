// src/app/orders/page.tsx
"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import OrderCard from '@/components/orders/OrderCard';
import type { Order } from '../../types';
import Icon from '@/components/ui/Icon';
import OrdersPageSkeleton from '@/components/skeletons/OrdersPageSkeleton';
// FIX: Replaced `startOfDay` with a manual implementation to resolve module resolution error.
import { addDays, isAfter } from 'date-fns';

type DateFilter = 'all' | 'today' | '7d' | '30d';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07,
        },
    },
};


const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            if (!res.ok) throw new Error("Failed to load orders.");
            const data = await res.json();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, refreshKey]);

    const filteredOrders = useMemo(() => {
        if (dateFilter === 'all') return orders;
        const now = new Date();
        let startDate: Date;
        if (dateFilter === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            startDate = today;
        } else if (dateFilter === '7d') {
            startDate = addDays(now, -7);
        } else { // 30d
            startDate = addDays(now, -30);
        }
        return orders.filter(order => isAfter(new Date(order.createdAt), startDate));
    }, [orders, dateFilter]);

    const summary = useMemo(() => {
        const totalValue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        return {
            count: filteredOrders.length,
            totalValue
        };
    }, [filteredOrders]);


    if (loading) {
        return <OrdersPageSkeleton />;
    }

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-transparent min-h-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-start mb-6"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
                    <p className="text-gray-500 mt-1">Track and manage all direct customer orders.</p>
                </div>
                <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                    {(['all', 'today', '7d', '30d'] as DateFilter[]).map(filter => (
                        <button
                            key={filter}
                            onClick={() => setDateFilter(filter)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${dateFilter === filter ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            {filter === 'all' ? 'All Time' : filter === 'today' ? 'Today' : `Last ${filter.replace('d', '')} Days`}
                        </button>
                    ))}
                </div>
            </motion.div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-center mb-4">{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <motion.div
                    layout
                    className="lg:col-span-3 space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    isExpanded={order.id === expandedOrderId}
                                    onToggle={() => setExpandedOrderId(prev => prev === order.id ? null : order.id)}
                                    onUpdate={() => setRefreshKey(prev => prev + 1)}
                                />
                            ))
                        ) : (
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16 bg-white rounded-lg border">
                                <Icon name="package" size={40} className="mx-auto text-gray-300" />
                                <h3 className="mt-2 text-lg font-medium text-gray-700">No Orders Found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No orders match the current filter.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border text-center sticky top-6">
                        <p className="text-sm font-medium text-gray-600">Filtered Orders</p>
                        <p className="text-5xl font-bold text-blue-600 mt-1">{summary.count}</p>
                        <p className="text-sm font-medium text-gray-600 mt-4">Total Value</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">₹{summary.totalValue.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;