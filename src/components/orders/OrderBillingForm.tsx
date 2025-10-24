// src/components/orders/OrderBillingForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import type { Order, Payment } from '../../types';
import { Send, Link as LinkIcon, Banknote, QrCode, Plus, Loader2 } from 'lucide-react';
import type { Socket } from 'socket.io-client';
import { format } from 'date-fns';
import Modal from '../ui/Modal';

interface OrderBillingFormProps {
    order: Order;
    onBack: () => void;
    onFinalized: () => void; // This prop might be unused now but keeping for consistency
    socket: Socket | null;
}

const OrderBillingForm: React.FC<OrderBillingFormProps> = ({ order, onBack, onFinalized, socket }) => {
    const [currentOrder, setCurrentOrder] = useState(order);
    const [payments, setPayments] = useState<Payment[]>(currentOrder.payments || []);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [newPayment, setNewPayment] = useState({ amount: '', method: 'Cash', notes: '' });
    const [loading, setLoading] = useState(false);

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const amountDue = currentOrder.total - totalPaid;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!currentOrder.id) return;
            const res = await fetch(`/api/orders/${currentOrder.id}`);
            if (res.ok) {
                const updatedOrder = await res.json();
                setCurrentOrder(updatedOrder);
                setPayments(updatedOrder.payments || []);
            }
        }
        fetchOrderDetails();

        if (socket) {
            const handleOrderUpdate = (updatedOrder: Order) => {
                if (updatedOrder.id === currentOrder.id) {
                    setCurrentOrder(updatedOrder);
                    setPayments(updatedOrder.payments || []);
                }
            };
            socket.on('order_update', handleOrderUpdate);
            return () => { socket.off('order_update', handleOrderUpdate); };
        }
    }, [currentOrder.id, socket]);

    const handleAction = async (action: string) => {
        setActionLoading(action);
        setError('');
        try {
            const res = await fetch(`/api/orders/${currentOrder.id}/send-payment-action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Action failed.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleAddPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/orders/${currentOrder.id}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newPayment, amount: parseFloat(newPayment.amount) })
            });

            const updatedOrderData = await res.json();

            if (!res.ok) {
                throw new Error(updatedOrderData.error || 'Failed to add payment.');
            }

            setCurrentOrder(updatedOrderData);
            setPayments(updatedOrderData.payments || []);

            setIsPaymentModalOpen(false);
            setNewPayment({ amount: '', method: 'Cash', notes: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            {error && <p className="text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 p-2 rounded-md text-sm mb-2">{error}</p>}

            {/* Payment Summary */}
            <div className="p-3 border dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-100">Payment Status</h4>
                <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between"><span>Total Bill:</span> <span className="font-bold text-gray-800 dark:text-gray-100">₹{currentOrder.total.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Total Paid:</span> <span className="font-bold text-green-600 dark:text-green-400">₹{totalPaid.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Amount Due:</span> <span className="font-bold text-red-600 dark:text-red-400">₹{amountDue.toFixed(2)}</span></div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 max-h-24 overflow-y-auto">
                    {payments.map(p => (
                        <div key={p.id} className="flex justify-between items-center border-t dark:border-gray-600 py-1">
                            <span>{p.method} ({format(new Date(p.createdAt), 'PP')})</span>
                            <span>₹{p.amount.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <button onClick={() => setIsPaymentModalOpen(true)} className="w-full mt-3 flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 py-2 rounded-md">
                    <Plus size={16} className="mr-1" /> Record Manual Payment
                </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
                <h4 className="font-semibold text-sm pt-2 text-gray-800 dark:text-gray-100">Payment Actions</h4>
                <button onClick={() => handleAction('send_bill_image')} disabled={!!actionLoading} className="w-full flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    {actionLoading === 'send_bill_image' ? <Loader2 className="animate-spin" /> : <><Send size={16} className="mr-2" /> Send Bill Image</>}
                </button>
                <button onClick={() => handleAction('send_razorpay')} disabled={!!actionLoading || amountDue <= 0} className="w-full flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    {actionLoading === 'send_razorpay' ? <Loader2 className="animate-spin" /> : <><LinkIcon size={16} className="mr-2" /> Send Payment Link</>}
                </button>
                <button onClick={() => handleAction('send_bank_details')} disabled={!!actionLoading || amountDue <= 0} className="w-full flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    {actionLoading === 'send_bank_details' ? <Loader2 className="animate-spin" /> : <><Banknote size={16} className="mr-2" /> Send Bank Details</>}
                </button>
                <button onClick={() => handleAction('send_qr_code')} disabled={!!actionLoading || amountDue <= 0} className="w-full flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    {actionLoading === 'send_qr_code' ? <Loader2 className="animate-spin" /> : <><QrCode size={16} className="mr-2" /> Send UPI QR Code</>}
                </button>
            </div>

            <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Record Manual Payment">
                <form onSubmit={handleAddPayment} className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                        <input type="number" placeholder="Amount paid" value={newPayment.amount} onChange={e => setNewPayment(p => ({ ...p, amount: e.target.value }))} required className="w-full border rounded-md p-2 text-sm mt-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Method</label>
                        <select value={newPayment.method} onChange={e => setNewPayment(p => ({ ...p, method: e.target.value }))} className="w-full border rounded-md p-2 text-sm mt-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                            <option>Cash</option> <option>Bank Transfer</option> <option>UPI</option> <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                        <input type="text" placeholder="e.g., Transaction ID" value={newPayment.notes} onChange={e => setNewPayment(p => ({ ...p, notes: e.target.value }))} className="w-full border rounded-md p-2 text-sm mt-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-sm border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-green-600 text-white rounded-md disabled:opacity-50">
                            {loading ? 'Adding...' : 'Add Payment'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default OrderBillingForm;