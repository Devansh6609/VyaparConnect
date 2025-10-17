
// src/components/dashboard/PendingOrders.tsx
import React from 'react';
import type { Order } from '../../types';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface PendingOrdersProps {
    items: Order[];
}

const PendingOrders: React.FC<PendingOrdersProps> = ({ items = [] }) => {
    return (
        <div className="bg-white dark:bg-[var(--card-background)] p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-[var(--card-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-primary">Pending Orders</h3>
                <Icon name="clock" className="text-gray-400 dark:text-tertiary" />
            </div>
            <div className="mt-4 flow-root">
                {items.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                <tr>
                                    <th className="py-2 px-3 text-left">Customer</th>
                                    <th className="py-2 px-3 text-left">Items</th>
                                    <th className="py-2 px-3 text-right">Value</th>
                                    <th className="py-2 px-3 text-right">Age</th>
                                    <th className="py-2 px-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-[var(--card-border)]">
                                {items.map(order => (
                                    <tr key={order.id}>
                                        <td className="py-3 px-3 font-medium">{order.customerName}</td>
                                        <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{order.items.length} item(s)</td>
                                        <td className="py-3 px-3 text-right font-semibold">₹{order.total.toLocaleString('en-IN')}</td>
                                        <td className="py-3 px-3 text-right text-gray-500">{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</td>
                                        <td className="py-3 px-3 text-right">
                                            <Link href={`/orders`} className="text-blue-600 hover:underline font-semibold text-xs">
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Icon name="checkCheck" size={24} className="mx-auto text-gray-400 dark:text-tertiary" />
                        <p className="text-sm text-gray-500 dark:text-secondary mt-2">No pending orders. All caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingOrders;