"use client";
import React from 'react';
// FIX: Used type-only import to prevent module resolution errors.
import type { Quotation } from '@/types';
import { X, Send, Loader2, AlertCircle } from 'lucide-react';

interface QuotationPreviewModalProps {
    quotation: Quotation | null;
    onClose: () => void;
    onSend: (quotationId: string) => void;
    isSending?: boolean;
    error?: string | null;
}

const QuotationPreviewModal: React.FC<QuotationPreviewModalProps> = ({ quotation, onClose, onSend, isSending, error }) => {
    if (!quotation) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Quotation Preview</h2>
                    <button onClick={onClose}><X /></button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <div className="flex justify-between mb-4">
                        <div>
                            <p><strong>To:</strong> {quotation.customerName}</p>
                            <p><strong>Phone:</strong> {quotation.contactNumber}</p>
                        </div>
                        <div>
                            <p><strong>Date:</strong> {new Date(quotation.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                            <h4 className="font-semibold text-gray-500 dark:text-gray-400">Billing Address</h4>
                            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{quotation.billingAddress}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-500 dark:text-gray-400">Shipping Address</h4>
                            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{quotation.shippingAddress}</p>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="p-2">Product</th>
                                <th className="p-2 text-center">Qty</th>
                                <th className="p-2 text-right">Price</th>
                                <th className="p-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotation.items.map(item => (
                                <tr key={item.id} className="border-b dark:border-gray-600">
                                    <td className="p-2">{item.product?.name}</td>
                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-right">₹{item.price.toFixed(2)}</td>
                                    <td className="p-2 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 text-right">
                        <p><strong>Subtotal:</strong> ₹{quotation.subtotal.toFixed(2)}</p>
                        {/* More details like tax, discount can be added here */}
                        <p className="font-bold text-xl"><strong>Total:</strong> ₹{quotation.total.toFixed(2)}</p>
                    </div>
                </main>
                <footer className="p-4 border-t dark:border-gray-700 flex flex-col">
                    {error && (
                        <div className="p-2 mb-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-md text-sm flex items-center">
                            <AlertCircle size={16} className="mr-2" />
                            {error}
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="border dark:border-gray-600 rounded-md px-4 py-2 text-sm">Cancel</button>
                        <button
                            onClick={() => onSend(quotation.id)}
                            className="bg-green-600 text-white rounded-md px-4 py-2 text-sm flex items-center justify-center w-40"
                            disabled={isSending}
                        >
                            {isSending ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <Send size={16} className="mr-2" />
                                    Send to Customer
                                </>
                            )}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default QuotationPreviewModal;