
// src/components/orders/OrderHistory.tsx
"use client";
import React, { useState, useEffect } from 'react';
import type { Order } from '../../types';
import { Plus, Send, RefreshCw, Edit, Trash2, Loader2, Package } from 'lucide-react';
import { format } from 'date-fns';
import OrderStatusBadge from './OrderStatusBadge';
import Modal from '../ui/Modal';
import { motion, type Variants } from 'framer-motion';

interface OrderHistoryProps {
    contactId: string;
    onNewOrder: () => void;
    onManagePayments: (order: Order) => void;
}

const listContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ contactId, onNewOrder, onManagePayments }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders?contactId=${contactId}`);
            if (res.ok) setOrders(await res.json());
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (contactId) fetchOrders();
    }, [contactId]);

    const handleDelete = async () => {
        if (!orderToDelete) return;
        setDeletingId(orderToDelete.id);
        try {
            const res = await fetch(`/api/orders/${orderToDelete.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete order.");
            setOrders(prev => prev.filter(q => q.id !== orderToDelete.id));
            setOrderToDelete(null);
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Order History</h3>
                <div className="flex items-center space-x-2">
                    <button onClick={fetchOrders} disabled={loading} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-50">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={onNewOrder} className="flex items-center bg-blue-600 text-white text-sm px-3 py-2 rounded-md hover:bg-blue-700">
                        <Plus size={16} className="mr-1" /> New
                    </button>
                </div>
            </div>
            {loading ? (
                <p className="text-sm text-gray-500 text-center py-8">Loading...</p>
            ) : orders.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No orders found for this contact.</p>
            ) : (
                <motion.ul
                    className="space-y-3"
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {orders.map(order => (
                        <motion.li
                            key={order.id}
                            className="p-3 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            variants={itemVariants}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-sm">Order #{order.id.substring(0, 6)}</p>
                                    <p className="text-xs text-gray-500">{format(new Date(order.createdAt), 'PP')}</p>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-lg font-bold">₹{order.total.toLocaleString('en-IN')}</p>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => onManagePayments(order)} className="flex items-center text-blue-600 text-sm font-semibold hover:underline">
                                        <Package size={14} className="mr-1" /> Manage Payments
                                    </button>
                                    <button
                                        onClick={() => setOrderToDelete(order)}
                                        className="p-1.5 text-gray-400 hover:bg-red-100 hover:text-red-600 rounded-full dark:hover:bg-red-900/30"
                                        title="Delete Order"
                                        disabled={!!deletingId}
                                    >
                                        {deletingId === order.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
            {orderToDelete && (
                <Modal isOpen={!!orderToDelete} onClose={() => setOrderToDelete(null)} title="Confirm Deletion">
                    <p>Are you sure you want to delete Order <strong>#{orderToDelete.id.substring(0, 6)}</strong>? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={() => setOrderToDelete(null)} className="px-4 py-2 border dark:border-gray-600 rounded-md">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md" disabled={!!deletingId}>
                            {deletingId ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default OrderHistory;
