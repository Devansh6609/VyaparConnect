// src/components/orders/OrderStatusBadge.tsx
import React from 'react';
import { OrderStatus } from '@/types';

interface StatusBadgeProps {
    status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
    PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Confirmed', className: 'bg-blue-100 text-blue-700' },
    SHIPPED: { label: 'Shipped', className: 'bg-indigo-100 text-indigo-700' },
    DELIVERED: { label: 'Delivered', className: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};

const OrderStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config = statusConfig[status] || { label: 'Unknown', className: 'bg-gray-100 text-gray-700' };

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${config.className}`}>
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;