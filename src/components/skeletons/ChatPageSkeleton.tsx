// src/components/skeletons/ChatPageSkeleton.tsx
import React from 'react';
import Skeleton from '../ui/Skeleton';
import ChatListSkeleton from './ChatListSkeleton';

const ChatViewSkeleton = () => (
    <div className="w-full flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b dark:border-[var(--card-border)] flex items-center">
            <Skeleton className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-1">
                <Skeleton className="h-5 w-1/3 mb-1" />
                <Skeleton className="h-3 w-1/4" />
            </div>
        </div>
        {/* Messages */}
        <div className="flex-1 p-4 space-y-4">
            <div className="flex justify-start"> <Skeleton className="h-10 w-2/5 rounded-lg" /> </div>
            <div className="flex justify-end"> <Skeleton className="h-16 w-3/5 rounded-lg" /> </div>
            <div className="flex justify-start"> <Skeleton className="h-8 w-1/3 rounded-lg" /> </div>
            <div className="flex justify-end"> <Skeleton className="h-12 w-1/2 rounded-lg" /> </div>
        </div>
        {/* Input */}
        <div className="p-4 border-t dark:border-[var(--card-border)]">
            <Skeleton className="h-12 w-full rounded-full" />
        </div>
    </div>
);

const ChatPageSkeleton = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-80 border-r dark:border-[var(--card-border)] flex flex-col">
                <div className="p-4 border-b dark:border-[var(--card-border)]">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <ChatListSkeleton />
            </div>
            <div className="flex-1 flex flex-col">
                <ChatViewSkeleton />
            </div>
        </div>
    );
};

export default ChatPageSkeleton;
