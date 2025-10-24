"use client";
import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for types to use a relative path.
import type { CustomerPipelineItem } from '@/types';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';

const STAGES = ['NEW_LEAD', 'CONTACTED', 'SENT', 'BILLED', 'PAID', 'CANCELLED'];
const STAGE_LABELS: Record<string, string> = {
    NEW_LEAD: 'New Lead',
    CONTACTED: 'Contacted',
    SENT: 'Quotation Sent',
    BILLED: 'Billed',
    PAID: 'Paid',
    CANCELLED: 'Cancelled',
};

interface CustomerPipelineProps {
    items: CustomerPipelineItem[];
}

const CustomerPipeline: React.FC<CustomerPipelineProps> = ({ items }) => {
    const [filter, setFilter] = useState<string>('all');

    const filteredItems = useMemo(() => {
        if (filter === 'all') return items;
        return items.filter(item => item.stage === filter);
    }, [items, filter]);

    return (
        <div className="bg-white dark:bg-[var(--card-background)] p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-[var(--card-border)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Customer Pipeline</h3>
                <div className="flex items-center space-x-2 overflow-x-auto py-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>All</button>
                    {STAGES.map(stage => (
                        <button key={stage} onClick={() => setFilter(stage)} className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${filter === stage ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{STAGE_LABELS[stage]}</button>
                    ))}
                </div>
            </div>

            <div className="mt-4 flow-root">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Stage</th>
                                <th className="px-4 py-3">Last Activity</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-[var(--card-border)]">
                            {filteredItems.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-4 py-3 font-medium dark:text-gray-100">{item.name}</td>
                                    <td className="px-4 py-3 dark:text-gray-300">{STAGE_LABELS[item.stage] || item.stage}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.latestActivity}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={`/chat?contactId=${item.id}`} className="text-blue-600 hover:underline font-semibold">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredItems.length === 0 && <p className="text-center text-gray-500 dark:text-gray-300 py-8">No customers in this stage.</p>}
            </div>
        </div>
    );
};

export default CustomerPipeline;