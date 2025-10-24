// src/components/transactions/StatusBadge.tsx
import React from 'react';
// FIX: Used type-only import with path alias to prevent module resolution errors.
import type { QuotationStatus } from '@/types';

interface StatusBadgeProps {
    status: QuotationStatus;
}

const statusConfig: Record<QuotationStatus, { label: string; className: string }> = {
    DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
    SENT: { label: 'Sent', className: 'bg-blue-100 text-blue-700' },
    CONFIRMED: { label: 'Confirmed', className: 'bg-indigo-100 text-indigo-700' },
    BILLED: { label: 'Billed', className: 'bg-purple-100 text-purple-700' },
    PARTIALLY_PAID: { label: 'Partially Paid', className: 'bg-yellow-100 text-yellow-800' },
    PAID: { label: 'Paid', className: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config = statusConfig[status] || { label: 'Unknown', className: 'bg-gray-100 text-gray-700' };

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${config.className}`}>
            {config.label}
        </span>
    );
};

// FIX: Added default export to resolve module import error.
export default StatusBadge;