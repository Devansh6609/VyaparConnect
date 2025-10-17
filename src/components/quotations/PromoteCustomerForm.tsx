





"use client";

import React, { useState } from 'react';
// FIX: Used type-only import to prevent module resolution errors.
import type { Contact } from '../../types';
import { Save, Loader2 } from 'lucide-react';

interface PromoteCustomerFormProps {
    contact: Contact;
    onSuccess: () => void;
    onCancel: () => void;
}

const PromoteCustomerForm: React.FC<PromoteCustomerFormProps> = ({ contact, onSuccess, onCancel }) => {
    const [name, setName] = useState(contact.name || '');
    const [shippingAddress, setShippingAddress] = useState(contact.shippingAddress || '');
    const [bankDetails, setBankDetails] = useState(contact.bankDetails || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/contacts/${contact.id}/promote-to-master`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, shippingAddress, bankDetails }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to promote customer.');
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-1">
            <h3 className="font-bold text-lg mb-4">Promote to Master Customer</h3>
            {error && <p className="text-red-600 bg-red-50 p-2 rounded-md text-sm mb-4">{error}</p>}

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Customer Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full border rounded-md p-2 text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Shipping Address</label>
                    <textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        rows={4}
                        className="mt-1 w-full border rounded-md p-2 text-sm"
                        placeholder="Enter full shipping address..."
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Bank Account Details</label>
                    <textarea
                        value={bankDetails}
                        onChange={(e) => setBankDetails(e.target.value)}
                        rows={4}
                        className="mt-1 w-full border rounded-md p-2 text-sm"
                        placeholder="Bank Name, Account Number, IFSC Code..."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border rounded-md">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                    {loading ? 'Saving...' : 'Promote & Save'}
                </button>
            </div>
        </form>
    );
};

export default PromoteCustomerForm;