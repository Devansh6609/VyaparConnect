// src/components/Dashboard.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { DashboardData } from '@/types';
import { Socket } from 'socket.io-client';
import KpiCard from './dashboard/KpiCard';
import AnalyticsChart from './dashboard/AnalyticsChart';
import RecentActivity from './dashboard/RecentActivity';
import SalesFunnel from './dashboard/SalesFunnel';
import { motion } from 'framer-motion';
import FollowUpCenter from './dashboard/FollowUpCenter';
import PendingOrders from './dashboard/PendingOrders';
import AiInsights from './dashboard/AiInsights';
import ActionItems from './dashboard/ActionItems';
import type { ServerToClientEvents } from '@/lib/socket-client';

interface DashboardProps {
    initialData: DashboardData;
    socket: Socket | null;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const Dashboard: React.FC<DashboardProps> = ({ initialData, socket }) => {
    const [data, setData] = useState(initialData);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const refreshDashboardData = useCallback(async () => {
        try {
            const res = await fetch('/api/dashboard');
            if (res.ok) {
                const newData = await res.json();
                setData(newData);
            }
        } catch (error) {
            console.error("Failed to refresh dashboard data", error);
        }
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            // Debounce the refresh to avoid too many calls in a short period
            debounceTimer.current = setTimeout(() => {
                refreshDashboardData();
            }, 1000); // 1-second debounce window
        };
        // FIX: Use the exported ServerToClientEvents type to correctly type the event names.
        const eventsToListen: (keyof ServerToClientEvents)[] = ['new_lead', 'newMessage', 'order_update', 'quotation_update'];

        eventsToListen.forEach(event => {
            socket.on(event, handleUpdate);
        });

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            eventsToListen.forEach(event => {
                socket.off(event, handleUpdate);
            });
        };
    }, [socket, refreshDashboardData]);

    const formattedRevenueData = data.revenueLast7Days.map(item => ({
        label: item.day,
        value: item.revenue,
    }));

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here's a snapshot of your business activity.</p>
            </motion.div>

            <div className="mt-6">
                <AiInsights summary={data.aiSummary} />
            </div>

            <motion.div
                className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}><KpiCard title="Today's Revenue" value={data.totalRevenue} icon="dollarSign" isCurrency /></motion.div>
                <motion.div variants={itemVariants}><KpiCard title="New Customers Today" value={data.newCustomers} icon="userPlus" /></motion.div>
                <motion.div variants={itemVariants}><KpiCard title="Today's Orders" value={data.totalOrders} icon="package" /></motion.div>
                <motion.div variants={itemVariants}><KpiCard title="Pending Payments" value={data.pendingPayments} icon="creditCard" isCurrency /></motion.div>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AnalyticsChart revenueData={formattedRevenueData} funnelData={data.salesFunnel} />
                </div>
                <div>
                    <RecentActivity contacts={data.recentActivity} />
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <FollowUpCenter items={data.followUpItems} />
                </div>
                <div>
                    <ActionItems items={data.pendingPaymentItems || []} />
                </div>
            </div>

            <div className="mt-8">
                <PendingOrders items={data.pendingOrders} />
            </div>

        </div>
    );
};

export default Dashboard;