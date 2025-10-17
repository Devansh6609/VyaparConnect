// src/components/orders/OrderDetailModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import type { Order, OrderStatus, OrderPaymentStatus, OrderItemStatus } from '../../types';
import OrderStatusBadge from './OrderStatusBadge';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface OrderDetailModalProps {
    orderId: string;
    isOpen: boolean;
    onClose: () => void;
}

const allOrderStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const allPaymentStatuses: OrderPaymentStatus[] = ['UNPAID', 'PARTIALLY_PAID', 'PAID'];
const allItemStatuses: OrderItemStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orderId, isOpen, onClose }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<string | null>(null); // To track which item is saving

    const fetchDetails = useCallback(async () => {
        if (!isOpen || !orderId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (!res.ok) throw new Error("Failed to fetch order details.");
            const data = await res.json();
            setOrder(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [isOpen, orderId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleStatusChange = async (type: 'order' | 'payment', value: OrderStatus | OrderPaymentStatus) => {
        if (!order) return;
        setIsSaving(type);
        try {
            const body = type === 'order' ? { status: value } : { paymentStatus: value };
            const res = await fetch(`/api/orders/${order.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Failed to update status');
            const updatedOrder = await res.json();
            setOrder(prev => prev ? { ...prev, ...updatedOrder } : updatedOrder);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(null);
        }
    };

    const handleItemStatusChange = async (itemId: string, status: OrderItemStatus) => {
        if (!order) return;
        setIsSaving(itemId);
        try {
            const res = await fetch(`/api/orders/items/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error('Failed to update item status');
            // Refetch all data to ensure consistency
            await fetchDetails();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Manage Order #${orderId.substring(0, 8)}`}>
            {loading ? (
                <div className="text-center p-8"><Loader2 className="animate-spin inline-block" /></div>
            ) : !order ? (
                <p className="text-center p-8 text-red-500">Could not load order details.</p>
            ) : (
                <div className="space-y-4 text-sm">
                    {/* Overall Status Controls */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div>
                            <label className="text-xs font-semibold">Order Status</label>
                            <select value={order.status} onChange={(e) => handleStatusChange('order', e.target.value as OrderStatus)} className="w-full border rounded-md p-1.5 mt-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600">
                                {allOrderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold">Payment Status</label>
                            <select value={order.paymentStatus} onChange={(e) => handleStatusChange('payment', e.target.value as OrderPaymentStatus)} className="w-full border rounded-md p-1.5 mt-1 text-sm bg-white dark:bg-gray-700 dark:border-gray-600">
                                {allPaymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div>
                        <h4 className="font-semibold mb-1">Items</h4>
                        <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs">
                                    <tr>
                                        <th className="p-2 font-medium">Product</th>
                                        <th className="p-2 font-medium text-center">Qty</th>
                                        <th className="p-2 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map(item => (
                                        <tr key={item.id} className="border-t dark:border-gray-700">
                                            <td className="p-2">{item.productName}</td>
                                            <td className="p-2 text-center">{item.quantity}</td>
                                            <td className="p-2">
                                                <select value={item.status} onChange={e => handleItemStatusChange(item.id, e.target.value as OrderItemStatus)} className="w-full border rounded-md p-1 text-xs bg-white dark:bg-gray-800 dark:border-gray-600" disabled={isSaving === item.id}>
                                                    {isSaving === item.id
                                                        ? <option>Saving...</option>
                                                        : allItemStatuses.map(s => <option key={s} value={s}>{s}</option>)
                                                    }
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default OrderDetailModal;