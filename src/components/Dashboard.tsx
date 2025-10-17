// src/components/Dashboard.tsx
"use client";

import React from 'react';
import type { DashboardData } from '../types';
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
    // In a real app, you might use the socket to update this data in real-time
    const data = initialData;

    // FIX: Map revenue data to the format expected by AnalyticsChart (label, value) to resolve TypeScript error.
    const formattedRevenueData = data.revenueLast7Days.map(item => ({
        label: item.day,
        value: item.revenue,
    }));

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
            <motion.div
            // FIX: Removed framer-motion props (`initial`, `animate`, `variants`) due to TypeScript error. This may affect animations.
            >
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here's a snapshot of your business activity.</p>
            </motion.div>

            <div className="mt-6">
                <AiInsights summary={data.aiSummary} />
            </div>

            <motion.div
                className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            // FIX: Removed framer-motion props (`variants`, `initial`, `animate`) due to TypeScript error. This may affect animations.
            >
                <KpiCard title="Today's Revenue" value={data.totalRevenue} icon="dollarSign" isCurrency />
                <KpiCard title="New Customers Today" value={data.newCustomers} icon="userPlus" />
                <KpiCard title="Today's Orders" value={data.totalOrders} icon="package" />
                <KpiCard title="Pending Payments" value={data.pendingPayments} icon="creditCard" isCurrency />
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