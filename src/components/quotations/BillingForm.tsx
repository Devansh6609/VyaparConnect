"use client";
import React, { useState, useEffect } from 'react';
// FIX: Used type-only import to prevent module resolution errors.
import type { Quotation, Payment } from '../../types';
import { Send, Link as LinkIcon, Banknote, QrCode, Plus, Loader2 } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { format } from 'date-fns';
import Modal from '../ui/Modal';


interface BillingFormProps {
    quotation: Quotation;
    onBack: () => void;
    onFinalized: () => void;
    socket: Socket | null;
}

const BillingForm: React.FC<BillingFormProps> = ({ quotation, onBack, onFinalized, socket }) => {
    const [currentQuotation, setCurrentQuotation] = useState(quotation);
    const [discountPercentage, setDiscountPercentage] = useState(currentQuotation.discountPercentage || 0);
    const [taxRate, setTaxRate] = useState(currentQuotation.taxRate || 0);
    const [deliveryCharges, setDeliveryCharges] = useState(currentQuotation.deliveryCharges || 0);
    const [total, setTotal] = useState(currentQuotation.total);
    const [payments, setPayments] = useState<Payment[]>(currentQuotation.payments || []);

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState('');

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [newPayment, setNewPayment] = useState({ amount: '', method: 'Cash', notes: '' });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const amountDue = total - totalPaid;
    const isBilled = currentQuotation.status !== 'DRAFT' && currentQuotation.status !== 'SENT' && currentQuotation.status !== 'CONFIRMED';


    useEffect(() => {
        const subtotal = currentQuotation.subtotal;
        const discountAmount = (subtotal * discountPercentage) / 100;
        const discountedSubtotal = subtotal - discountAmount;
        const taxAmount = (discountedSubtotal * taxRate) / 100;
        const finalTotal = discountedSubtotal + taxAmount + deliveryCharges;
        setTotal(finalTotal);
    }, [discountPercentage, taxRate, deliveryCharges, currentQuotation.subtotal]);

    const fetchPayments = async () => {
        try {
            const res = await fetch(`/api/quotations/${currentQuotation.id}/payments`);
            if (res.ok) {
                const paymentData = await res.json();
                setPayments(paymentData);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchPayments();
        if (socket) {
            const handleQuotationUpdate = (updatedQuotation: Quotation) => {
                if (updatedQuotation.id === currentQuotation.id) {
                    setCurrentQuotation(updatedQuotation);
                    setPayments(updatedQuotation.payments || []);
                }
            };
            (socket as any).on('quotation_update', handleQuotationUpdate);
            return () => {
                (socket as any).off('quotation_update', handleQuotationUpdate);
            };
        }
    }, [currentQuotation.id, socket]);

    const handleFinalize = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/quotations/${currentQuotation.id}/finalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ discountPercentage, taxRate, deliveryCharges, total })
            });
            if (!res.ok) throw new Error('Failed to save bill.');
            const updatedData = await res.json();
            setCurrentQuotation(updatedData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string, amount?: number) => {
        setActionLoading(action);
        setError('');
        try {
            const body: { action: string; amount?: number } = { action };
            if (amount !== undefined && amount > 0) {
                body.amount = amount;
            }

            const res = await fetch(`/api/quotations/${currentQuotation.id}/send-bill-action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
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
            const res = await fetch(`/api/quotations/${currentQuotation.id}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newPayment, amount: parseFloat(newPayment.amount) })
            });

            const updatedQuotationData = await res.json();

            if (!res.ok) {
                throw new Error(updatedQuotationData.error || 'Failed to add payment.');
            }

            // Update state directly from the response to ensure UI is in sync
            setCurrentQuotation(prev => {
                if (!prev) return updatedQuotationData;
                return {
                    ...prev,
                    status: updatedQuotationData.status,
                    payments: updatedQuotationData.payments
                }
            });
            setPayments(updatedQuotationData.payments || []);

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

            {/* Bill Calculation Section */}
            <div className="p-3 border dark:border-gray-700 rounded-lg space-y-3">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">Final Bill Calculation</h4>
                <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Discount (%)</label>
                    <input type="number" value={discountPercentage} onChange={e => setDiscountPercentage(parseFloat(e.target.value) || 0)} className="w-full border rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" disabled={isBilled} />
                </div>
                <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Tax / GST (%)</label>
                    <input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="w-full border rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" disabled={isBilled} />
                </div>
                <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Delivery Charges (₹)</label>
                    <input type="number" value={deliveryCharges} onChange={e => setDeliveryCharges(parseFloat(e.target.value) || 0)} className="w-full border rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" disabled={isBilled} />
                </div>
                <div className="text-right font-bold text-lg text-gray-800 dark:text-gray-100">Total: ₹{total.toFixed(2)}</div>
                {!isBilled && (
                    <button onClick={handleFinalize} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-semibold disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save & Lock Bill'}
                    </button>
                )}
            </div>

            {isBilled && (
                <>
                    {/* Payment Summary */}
                    <div className="p-3 border dark:border-gray-700 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-100">Payment Status</h4>
                        <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                            <div className="flex justify-between"><span>Total Bill:</span> <span className="font-bold text-gray-800 dark:text-gray-100">₹{total.toFixed(2)}</span></div>
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
                        <button onClick={() => handleAction('send_final_bill')} disabled={!!actionLoading} className="w-full flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionLoading === 'send_final_bill' ? <Loader2 className="animate-spin" /> : <><Send size={16} className="mr-2" /> Send Bill Image</>}
                        </button>
                        <button onClick={() => handleAction('send_razorpay', amountDue)} disabled={!!actionLoading || amountDue <= 0} className="w-full flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionLoading === 'send_razorpay' ? <Loader2 className="animate-spin" /> : <><LinkIcon size={16} className="mr-2" /> Send Payment Link</>}
                        </button>
                        <button onClick={() => handleAction('send_bank_details', amountDue)} disabled={!!actionLoading || amountDue <= 0} className="w-full flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionLoading === 'send_bank_details' ? <Loader2 className="animate-spin" /> : <><Banknote size={16} className="mr-2" /> Send Bank Details</>}
                        </button>
                        <button onClick={() => handleAction('send_qr_code', amountDue)} disabled={!!actionLoading || amountDue <= 0} className="w-full flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionLoading === 'send_qr_code' ? <Loader2 className="animate-spin" /> : <><QrCode size={16} className="mr-2" /> Send UPI QR Code</>}
                        </button>
                    </div>
                </>
            )}

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

export default BillingForm;