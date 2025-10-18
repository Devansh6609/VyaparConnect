"use client";

import React, { useState } from 'react';
// FIX: Changed import from non-existent 'User' to the correct 'Contact' type
import { Contact } from '@/types';
import { X } from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner'; // Assuming you need this for the button

interface PromoteCustomerModalProps {
    // FIX: Changed contact type from User to the correct Contact type
    contact: Contact;
    onClose: () => void;
    onSuccess: (updates: { shippingAddress: string; bankDetails: string }) => void;
}

const PromoteCustomerModal: React.FC<PromoteCustomerModalProps> = ({ contact, onClose, onSuccess }) => {
    const [address, setAddress] = useState(contact.shippingAddress || ''); // Use existing address as default
    const [bankDetails, setBankDetails] = useState(contact.bankDetails || ''); // Use existing bank details as default
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) {
            setError('Address is required to promote a customer.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`/api/contacts/${contact.id}/promote-to-master`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingAddress: address,
                    bankDetails: bankDetails,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to promote customer.');
            }

            onSuccess({ shippingAddress: address, bankDetails });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Promote to Master Customer</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <input
                            type="text"
                            value={contact.name}
                            readOnly
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                            type="text"
                            // FIX: Changed 'contact.phoneNumber' to 'contact.phone' based on Prisma schema history
                            value={contact.phone || ''}
                            readOnly
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Shipping Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the customer's full shipping address"
                        />
                    </div>
                    <div>
                        <label htmlFor="bankDetails" className="block text-sm font-medium text-gray-700">
                            Bank Details (Optional)
                        </label>
                        <textarea
                            id="bankDetails"
                            value={bankDetails}
                            onChange={(e) => setBankDetails(e.target.value)}
                            rows={3}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Account Name, Number, IFSC Code"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {/* FINAL FIX: Remove 'size' and 'className' props to resolve the IntrinsicAttributes error. 
                                We rely on default styling or inline CSS if absolutely necessary. */}
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <LoadingSpinner />
                                    <span className="ml-2">Saving...</span>
                                </span>
                            ) : (
                                'Save & Promote'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromoteCustomerModal;
