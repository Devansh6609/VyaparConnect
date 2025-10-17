// src/components/orders/OrderSummary.tsx
import React, { useState } from 'react';
import type { Order } from '../../types';
import { Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface OrderSummaryProps {
    order: Order;
    onDone: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order, onDone }) => {
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSent, setIsSent] = useState(false);

    const handleSendBill = async () => {
        setIsSending(true);
        setError(null);
        try {
            const res = await fetch(`/api/orders/${order.id}/send-bill`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to send bill.");
            }
            setIsSent(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSending(false);
        }
    };

    const subtotal = order.items.reduce((sum, item) => sum + (item.price * Number(item.quantity)), 0);
    const discountAmount = (subtotal * (order.discountPercentage || 0)) / 100;

    return (
        <div className="p-4">
            <h3 className="font-bold text-lg mb-4 text-center">Order Created!</h3>

            <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div>
                    <h4 className="font-semibold text-gray-500 dark:text-gray-400">Billing To</h4>
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{order.billingAddress}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-500 dark:text-gray-400">Shipping To</h4>
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{order.shippingAddress}</p>
                </div>
            </div>

            <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-900/50 space-y-3 text-sm">
                {/* Items Table */}
                <table className="w-full text-left">
                    <thead className="text-xs text-gray-500">
                        <tr><th className="pb-1 font-medium">Item</th><th className="pb-1 font-medium text-right">Price</th></tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id} className="border-t dark:border-gray-600">
                                <td className="py-2">{item.productName} <span className="text-gray-500">x {item.quantity}</span></td>
                                <td className="py-2 text-right">₹{item.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals Section */}
                <div className="space-y-1 pt-2 border-t dark:border-gray-600">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    {order.discountPercentage && order.discountPercentage > 0 && (
                        <div className="flex justify-between text-red-600 dark:text-red-400"><span>Discount ({order.discountPercentage}%)</span><span>- ₹{discountAmount.toFixed(2)}</span></div>
                    )}
                    {order.deliveryCharges && order.deliveryCharges > 0 && (
                        <div className="flex justify-between"><span>Delivery Charges</span><span>+ ₹{order.deliveryCharges.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between font-bold text-base pt-1 border-t dark:border-gray-600 mt-1"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
                </div>
            </div>

            <div className="mt-4">
                {error && (
                    <div className="p-2 mb-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-md text-sm flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        {error}
                    </div>
                )}

                {isSent ? (
                    <div className="p-3 text-center bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-md">
                        <CheckCircle className="inline-block mr-2" /> Bill sent successfully!
                    </div>
                ) : (
                    <button
                        onClick={handleSendBill}
                        className="w-full bg-green-600 text-white rounded-md px-4 py-2.5 text-sm font-semibold flex items-center justify-center"
                        disabled={isSending}
                    >
                        {isSending ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <Send size={16} className="mr-2" />
                                Send Bill as Image
                            </>
                        )}
                    </button>
                )}
                <button onClick={onDone} className="w-full mt-2 text-sm text-gray-600 dark:text-gray-400 py-2 hover:underline">
                    Done
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;