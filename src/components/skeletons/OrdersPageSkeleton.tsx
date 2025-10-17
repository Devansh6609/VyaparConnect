// src/components/skeletons/OrdersPageSkeleton.tsx
import React from 'react';
import Skeleton from '../ui/Skeleton';

const OrderCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <div className="md:col-span-3 space-y-2">
                <Skeleton className="h-6 w-3/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="md:col-span-1">
                <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="md:col-span-2 flex justify-start md:justify-end">
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </div>
        <div className="border-t dark:border-gray-700 mt-3 pt-3 flex justify-between items-center">
            <Skeleton className="h-4 w-1/3" />
            <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    </div>
);

const OrdersPageSkeleton = () => {
    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-80 mt-2" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <OrderCardSkeleton key={i} />
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 text-center">
                        <Skeleton className="h-12 w-16 mx-auto" />
                        <Skeleton className="h-4 w-32 mx-auto mt-2" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPageSkeleton;