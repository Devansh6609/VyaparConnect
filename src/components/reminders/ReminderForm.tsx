"use client";
import React, { useState } from 'react';
import type { Quotation } from '../../types';
import { Loader2, Bell } from 'lucide-react';
import { addDays, format } from 'date-fns';

interface ReminderFormProps {
    quotation: Quotation;
    onCancel: () => void;
    onSuccess: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ quotation, onCancel, onSuccess }) => {
    const [remindAt, setRemindAt] = useState(format(addDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm"));

    const defaultOwnerMessage = `Follow up with ${quotation.customerName} about Quotation #${quotation.id.substring(0, 6)}.`;
    const defaultCustomerMessage = `Hi ${quotation.customerName}, this is a friendly follow-up regarding the quotation for ₹${quotation.total.toLocaleString('en-IN')} we sent you recently. Please let us know if you have any questions or are ready to proceed. Thank you!`;

    const [ownerMessage, setOwnerMessage] = useState(defaultOwnerMessage);
    const [customerMessage, setCustomerMessage] = useState(defaultCustomerMessage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/contacts/${quotation.contactId}/reminders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    remindAt: new Date(remindAt).toISOString(),
                    ownerMessage,
                    customerMessage,
                    quotationId: quotation.id,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to set reminder.");
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && <p className="text-red-600 bg-red-50 p-2 rounded-md text-sm">{error}</p>}

            <div>
                <label className="text-sm font-medium">Remind on</label>
                <input
                    type="datetime-local"
                    value={remindAt}
                    onChange={(e) => setRemindAt(e.target.value)}
                    className="mt-1 w-full border rounded-md p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium">Internal Note (for you)</label>
                <textarea
                    value={ownerMessage}
                    onChange={(e) => setOwnerMessage(e.target.value)}
                    rows={2}
                    className="mt-1 w-full border rounded-md p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium">Automated Message (to customer)</label>
                <textarea
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    rows={4}
                    className="mt-1 w-full border rounded-md p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to not send an automated message.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border dark:border-gray-600 rounded-md">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Bell className="mr-2" size={16} />}
                    Set Reminder
                </button>
            </div>
        </form>
    );
};

export default ReminderForm;