// src/components/orders/OrderCard.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import type { Order, OrderStatus, OrderItemStatus } from '../../types';
import OrderStatusBadge from './OrderStatusBadge';
import { format } from 'date-fns';
import { MessageCircle, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/Icon';

interface OrderCardProps {
    order: Order;
    isExpanded: boolean;
    onToggle: () => void;
    onUpdate: () => void;
}

const allOrderStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const allItemStatuses: OrderItemStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, isExpanded, onToggle, onUpdate }) => {
    const [isSaving, setIsSaving] = useState<string | null>(null);

    const handleOrderStatusChange = async (newStatus: OrderStatus) => {
        if (newStatus === order.status) return;
        setIsSaving('order');
        try {
            const res = await fetch(`/api/orders/${order.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Failed to update status');
            onUpdate();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(null);
        }
    };

    const handleItemStatusChange = async (itemId: string, newStatus: OrderItemStatus) => {
        const item = order.items.find(i => i.id === itemId);
        if (!item || item.status === newStatus) return;
        setIsSaving(itemId);
        try {
            const res = await fetch(`/api/orders/items/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Failed to update item status');
            onUpdate();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(null);
        }
    };

    const itemsSummary = order.items.length > 1
        ? `${order.items[0].productName || 'Item'} & ${order.items.length - 1} more`
        : order.items[0]?.productName || 'Item not specified';

    const totalPaid = order.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const amountDue = order.total - totalPaid;

    return (
        <motion.div
            layout
            variants={itemVariants}
            className="bg-white dark:bg-[var(--card-background)] rounded-lg shadow-sm border dark:border-[var(--card-border)] overflow-hidden"
        >
            <motion.div
                layout
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                onClick={onToggle}
            >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-3">
                        <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{order.customerName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{itemsSummary}</p>
                    </div>
                    <div className="md:col-span-1 text-left md:text-right">
                        <p className="font-semibold text-lg dark:text-gray-100">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="md:col-span-2 flex justify-between md:justify-end items-center">
                        <OrderStatusBadge status={order.status} />
                        <motion.div layout="position">
                            <ChevronDown size={20} className={`ml-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </motion.div>
                    </div>
                </div>
                <div className="mt-3 pt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div>
                        ID: <span className="font-mono text-xs">{order.id.substring(0, 8)}...</span>
                        <span className="mx-2">|</span>
                        {format(new Date(order.createdAt), 'dd MMM, yyyy')}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={`/chat?contactId=${order.contactId}`} onClick={e => e.stopPropagation()} className="p-2 text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full" title="Chat with Customer">
                            <Icon name="messageCircle" size={18} />
                        </Link>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.section
                        key="content"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            hidden: { opacity: 0, height: 0 },
                            visible: { opacity: 1, height: 'auto' }
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border-t dark:border-[var(--card-border)] text-sm">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {/* Left Side: Items Table */}
                                <div className="overflow-x-auto">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">Order Items</h4>
                                        <div className="flex items-center space-x-2">
                                            {isSaving === 'order' && <Loader2 size={16} className="animate-spin text-gray-500" />}
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleOrderStatusChange(e.target.value as OrderStatus)}
                                                className="text-xs border rounded-md p-1 bg-white dark:bg-gray-700 dark:border-gray-600"
                                                disabled={isSaving === 'order'}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {allOrderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <table className="w-full text-xs">
                                        <thead className="text-left bg-gray-200 dark:bg-gray-700">
                                            <tr>
                                                <th className="p-2">Item</th>
                                                <th className="p-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-gray-700">
                                            {order.items.map(item => (
                                                <tr key={item.id}>
                                                    <td className="p-2 font-medium">{item.productName} ({item.quantity})</td>
                                                    <td className="p-2">
                                                        <div className="flex items-center">
                                                            <select
                                                                value={item.status}
                                                                onChange={e => handleItemStatusChange(item.id, e.target.value as OrderItemStatus)}
                                                                className="w-full border rounded-md p-1 text-xs bg-white dark:bg-gray-800 dark:border-gray-600"
                                                                disabled={isSaving === item.id}
                                                                onClick={e => e.stopPropagation()}
                                                            >
                                                                {allItemStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                            </select>
                                                            {isSaving === item.id && <Loader2 size={14} className="animate-spin text-gray-500 ml-2" />}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Right Side: Payment Summary */}
                                <div>
                                    <div className="p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900/50">
                                        <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-100">Payment Summary</h4>
                                        <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                                            <div className="flex justify-between"><span>Total Bill:</span> <span className="font-bold text-gray-800 dark:text-gray-100">₹{order.total.toFixed(2)}</span></div>
                                            <div className="flex justify-between"><span>Total Paid:</span> <span className="font-bold text-green-600 dark:text-green-400">₹{totalPaid.toFixed(2)}</span></div>
                                            <div className="flex justify-between"><span>Amount Due:</span> <span className="font-bold text-red-600 dark:text-red-400">₹{amountDue.toFixed(2)}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default OrderCard;