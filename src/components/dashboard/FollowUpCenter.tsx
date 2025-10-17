
"use client";
import React, { useState } from 'react';
// FIX: Corrected import path for types to use a relative path.
import type { FollowUpItem } from '../../types';
import { Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Icon from '@/components/ui/Icon';

interface FollowUpCenterProps {
    items: FollowUpItem[];
}

const FollowUpCenter: React.FC<FollowUpCenterProps> = ({ items = [] }) => {
    const [sending, setSending] = useState<string | null>(null);
    const [sent, setSent] = useState<string[]>([]);

    const handleSendReminder = async (item: FollowUpItem) => {
        setSending(item.quotationId);
        try {
            const res = await fetch('/api/reminders/send-follow-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quotationId: item.quotationId, contactId: item.contactId })
            });
            if (!res.ok) throw new Error("Failed to send reminder");
            setSent(prev => [...prev, item.quotationId]);
        } catch (error) {
            console.error(error);
            alert("Could not send reminder. Please try again.");
        } finally {
            setSending(null);
        }
    };

    const availableItems = items.filter(item => !sent.includes(item.quotationId));

    return (
        <div className="bg-white dark:bg-[var(--card-background)] p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-[var(--card-border)] h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-primary">Follow-Up Center</h3>
                <Icon name="messageCircle" className="text-gray-400 dark:text-tertiary" />
            </div>
            <div className="mt-4 space-y-3">
                {availableItems.length > 0 ? (
                    availableItems.map((item) => (
                        <div key={item.quotationId} className="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                                    Follow up with {item.contactName}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-secondary mt-1">
                                    Quotation of ₹{item.quotationTotal.toLocaleString('en-IN')} sent {formatDistanceToNow(new Date(item.sentAt), { addSuffix: true })}
                                </p>
                            </div>
                            <button
                                onClick={() => handleSendReminder(item)}
                                disabled={!!sending}
                                className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-full flex-shrink-0 ml-2 disabled:opacity-50"
                                title="Send Reminder"
                            >
                                {sending === item.quotationId ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Icon name="checkCheck" size={24} className="mx-auto text-gray-400 dark:text-tertiary" />
                        <p className="text-sm text-gray-500 dark:text-secondary mt-2">No follow-ups needed right now!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowUpCenter;