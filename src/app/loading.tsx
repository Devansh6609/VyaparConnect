// src/app/loading.tsx
import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Loading() {
    // This component will be used by Next.js as a suspense fallback for page navigation.
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <LoadingSpinner />
        </div>
    );
}
