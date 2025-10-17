
import React from 'react';
// FIX: Used type-only import to prevent module resolution errors.
import type { PendingPaymentItem } from '../../types';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

interface ActionItemsProps {
  items: PendingPaymentItem[];
}

const ActionItems: React.FC<ActionItemsProps> = ({ items = [] }) => {
  return (
    <div className="bg-white dark:bg-[var(--card-background)] p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-[var(--card-border)] h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-primary">Action Items (Pending Payments)</h3>
        <Icon name="dollarSign" className="text-gray-400 dark:text-tertiary" />
      </div>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => {
            const totalPaid = item.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
            const amountDue = item.total - totalPaid;
            const itemType = item.type === 'order' ? 'Order' : 'Quotation';
            const reminderText = `Hi ${item.customerName}, this is a friendly reminder for the pending payment of ₹${amountDue.toFixed(2)} for ${itemType} #${item.id.substring(0, 6)}. Thank you!`;
            const href = `/chat?contactId=${item.contactId}&message=${encodeURIComponent(reminderText)}`;

            return (
              <div key={item.id} className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded-r-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">Payment Due: ₹{amountDue.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-600 dark:text-secondary mt-1">
                    For: <span className="font-medium">{item.customerName}</span> - Billed {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <Link href={href} className="p-2 text-gray-500 dark:text-secondary hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full flex-shrink-0 ml-2" title="Send Reminder">
                  <MessageCircle size={18} />
                </Link>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Icon name="checkCheck" size={24} className="mx-auto text-gray-400 dark:text-tertiary" />
            <p className="text-sm text-gray-500 dark:text-secondary mt-2">No pending payments. Good job!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionItems;