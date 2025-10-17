// src/components/skeletons/ChatListSkeleton.tsx
import React from 'react';
import Skeleton from '../ui/Skeleton';

const ChatListItemSkeleton = () => (
    <div className="flex items-center p-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="ml-3 flex-1">
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-2/4" />
                <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="mt-2">
                <Skeleton className="h-3 w-3/4" />
            </div>
        </div>
    </div>
);


const ChatListSkeleton = () => {
    return (
        <div className="pt-2">
            {[...Array(8)].map((_, i) => (
                <ChatListItemSkeleton key={i} />
            ))}
        </div>
    );
};

export default ChatListSkeleton;
