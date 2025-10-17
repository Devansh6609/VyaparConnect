


"use client";
import React, { useState, useEffect } from 'react';
import type { Quotation } from '../../types';
import { Plus, Send, RefreshCw, Edit, Trash2, Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { motion } from 'framer-motion';

interface QuotationHistoryProps {
    contactId: string;
    onNewQuote: () => void;
    onBillQuote: (quotation: Quotation) => void;
    onSendDraft: (quotation: Quotation) => void;
    onSetFollowUp: (quotation: Quotation) => void;
}

const getStatusColor = (status: Quotation['status']): 'green' | 'gray' | 'red' | 'yellow' => {
    switch (status) {
        case 'PAID':
        case 'BILLED':
        case 'CONFIRMED':
            return 'green';
        case 'PARTIALLY_PAID':
            return 'yellow';
        case 'CANCELLED':
            return 'red';
        default:
            return 'gray';
    }
};

const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } }
};
const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};


const QuotationHistory: React.FC<QuotationHistoryProps> = ({ contactId, onNewQuote, onBillQuote, onSendDraft, onSetFollowUp }) => {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);


    const fetchQuotations = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/quotations?contactId=${contactId}`);
            if (res.ok) {
                setQuotations(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch quotations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (contactId) {
            fetchQuotations();
        }
    }, [contactId]);

    const handleDelete = async () => {
        if (!quotationToDelete) return;
        setDeletingId(quotationToDelete.id);
        try {
            const res = await fetch(`/api/quotations/${quotationToDelete.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete quotation");
            setQuotations(prev => prev.filter(q => q.id !== quotationToDelete.id));
            setQuotationToDelete(null);
        } catch (error) {
            console.error(error);
            // You might want to show an error to the user here
        } finally {
            setDeletingId(null);
        }
    };

    const renderActionButton = (q: Quotation) => {
        switch (q.status) {
            case 'DRAFT':
                return (
                    <button onClick={() => onSendDraft(q)} className="flex items-center text-blue-600 text-sm font-semibold hover:underline">
                        <Send size={14} className="mr-1" /> Review & Send
                    </button>
                );
            case 'SENT':
                return (
                    <>
                        <button onClick={() => onSetFollowUp(q)} className="flex items-center text-orange-600 text-sm font-semibold hover:underline">
                            <Clock size={14} className="mr-1" /> Set Follow-up
                        </button>
                        <button onClick={() => onBillQuote(q)} className="flex items-center text-green-600 text-sm font-semibold hover:underline ml-2">
                            <Edit size={14} className="mr-1" /> Finalize & Bill
                        </button>
                    </>
                );
            case 'CONFIRMED':
                return (
                    <button onClick={() => onBillQuote(q)} className="flex items-center text-green-600 text-sm font-semibold hover:underline">
                        <Send size={14} className="mr-1" /> Finalize & Bill
                    </button>
                );
            case 'BILLED':
            case 'PARTIALLY_PAID':
                return (
                    <button onClick={() => onBillQuote(q)} className="flex items-center text-blue-600 text-sm font-semibold hover:underline">
                        <Edit size={14} className="mr-1" /> Manage Payments
                    </button>
                );
            case 'PAID':
                return <span className="text-sm font-semibold text-gray-400">Paid in full</span>;
            case 'CANCELLED':
                return <span className="text-sm font-semibold text-gray-400">Cancelled</span>;
            default:
                return null;
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Quotation History</h3>
                <div className="flex items-center space-x-2">
                    <button onClick={fetchQuotations} disabled={loading} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-50">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={onNewQuote} className="flex items-center bg-blue-600 text-white text-sm px-3 py-2 rounded-md hover:bg-blue-700">
                        <Plus size={16} className="mr-1" /> New
                    </button>
                </div>
            </div>
            {loading ? (
                <p className="text-sm text-gray-500 text-center py-8">Loading...</p>
            ) : quotations.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No quotations found for this contact.</p>
            ) : (
                <motion.ul
                    className="space-y-3"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {quotations.map(q => (
                        <motion.li
                            key={q.id}
                            variants={itemVariants}
                            className="p-3 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-sm">Quotation #{q.id.substring(0, 6)}</p>
                                    <p className="text-xs text-gray-500">{format(new Date(q.createdAt), 'PP')}</p>
                                </div>
                                <Badge color={getStatusColor(q.status)}>{q.status.replace('_', ' ')}</Badge>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-lg font-bold">₹{q.total.toLocaleString('en-IN')}</p>
                                <div className="flex items-center space-x-2">
                                    {renderActionButton(q)}
                                    <button
                                        onClick={() => setQuotationToDelete(q)}
                                        className="p-1.5 text-gray-400 hover:bg-red-100 hover:text-red-600 rounded-full dark:hover:bg-red-900/30"
                                        title="Delete Quotation"
                                        disabled={!!deletingId}
                                    >
                                        {deletingId === q.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
            {quotationToDelete && (
                <Modal isOpen={!!quotationToDelete} onClose={() => setQuotationToDelete(null)} title="Confirm Deletion">
                    <p>Are you sure you want to delete Quotation <strong>#{quotationToDelete.id.substring(0, 6)}</strong>? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={() => setQuotationToDelete(null)} className="px-4 py-2 border dark:border-gray-600 rounded-md">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md" disabled={!!deletingId}>
                            {deletingId ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default QuotationHistory;