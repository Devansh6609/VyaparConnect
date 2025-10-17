// src/components/skeletons/DashboardSkeleton.tsx
import React from 'react';
import Skeleton from '../ui/Skeleton';

const KpiCardSkeleton = () => (
    <div className="p-5 flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/2" />
        </div>
    </div>
);

const ChartSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 h-full">
        <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-1/3" />
            <div className="flex space-x-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
            </div>
        </div>
        <Skeleton className="h-64 w-full" />
    </div>
);

const ListSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 h-full">
        <Skeleton className="h-6 w-1/2 mb-6" />
        <div className="space-y-5">
            <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        </div>
    </div>
);

const DashboardSkeleton = () => {
    return (
        <div className="p-6 md:p-8">
            <div className="mb-6">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </div>

            <div className="mt-6">
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ChartSkeleton />
                </div>
                <div>
                    <ListSkeleton />
                </div>
            </div>
            <div className="mt-8">
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        </div>
    );
};

export default DashboardSkeleton;
