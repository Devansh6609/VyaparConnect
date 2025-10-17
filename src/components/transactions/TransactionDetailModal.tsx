// src/components/transactions/TransactionDetailModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
// FIX: Used type-only import with path alias to prevent module resolution errors.
import type { Quotation } from '../../types';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface TransactionDetailModalProps {
    quotationId: string;
    isOpen: boolean;
    onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ quotationId, isOpen, onClose }) => {
    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && quotationId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/quotations/${quotationId}`);
                    if (!res.ok) throw new Error("Failed to fetch details.");
                    const data = await res.json();
                    setQuotation(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [isOpen, quotationId]);

    const totalPaid = quotation?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const amountDue = (quotation?.total || 0) - totalPaid;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Transaction #${quotationId.substring(0, 8)}`}>
            {loading ? (
                <div className="text-center p-8"><Loader2 className="animate-spin inline-block" /></div>
            ) : !quotation ? (
                <p className="text-center p-8 text-red-500">Could not load transaction details.</p>
            ) : (
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p><strong>To:</strong> {quotation.customerName}</p>
                            <p><strong>Date:</strong> {format(new Date(quotation.createdAt), 'PP')}</p>
                        </div>
                        <StatusBadge status={quotation.status} />
                    </div>

                    <div>
                        <h4 className="font-semibold mb-1">Items</h4>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs">
                                <tr>
                                    <th className="p-2 font-medium">Product</th>
                                    <th className="p-2 font-medium text-center">Qty</th>
                                    <th className="p-2 font-medium text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotation.items.map(item => (
                                    <tr key={item.id} className="border-b dark:border-gray-700">
                                        <td className="p-2">{item.product?.name}</td>
                                        <td className="p-2 text-center">{item.quantity}</td>
                                        <td className="p-2 text-right">₹{(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-1">Pricing</h4>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md space-y-1">
                                <p className="flex justify-between"><span>Subtotal:</span> <span>₹{quotation.subtotal.toLocaleString()}</span></p>
                                {quotation.discountPercentage && <p className="flex justify-between"><span>Discount:</span> <span>({quotation.discountPercentage}%)</span></p>}
                                {quotation.taxRate && <p className="flex justify-between"><span>Tax:</span> <span>({quotation.taxRate}%)</span></p>}
                                {quotation.deliveryCharges && <p className="flex justify-between"><span>Delivery:</span> <span>₹{quotation.deliveryCharges.toLocaleString()}</span></p>}
                                <p className="flex justify-between font-bold border-t dark:border-gray-600 pt-1 mt-1"><span>Total:</span> <span>₹{quotation.total.toLocaleString()}</span></p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Payments</h4>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md space-y-1">
                                {quotation.payments?.map(p => (
                                    <p key={p.id} className="flex justify-between"><span>{p.method} ({format(new Date(p.createdAt), 'dd/MM/yy')})</span> <span>₹{p.amount.toLocaleString()}</span></p>
                                ))}
                                {quotation.payments?.length === 0 && <p className="text-gray-500 text-xs">No payments recorded.</p>}
                                <p className="flex justify-between font-bold text-green-600 border-t dark:border-gray-600 pt-1 mt-1"><span>Paid:</span> <span>₹{totalPaid.toLocaleString()}</span></p>
                                <p className="flex justify-between font-bold text-red-600"><span>Due:</span> <span>₹{amountDue.toLocaleString()}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default TransactionDetailModal;