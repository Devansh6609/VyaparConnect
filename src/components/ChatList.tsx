// src/components/ChatList.tsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import type { Contact, Message, Tag } from '../types';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/ui/Avatar';
import ChatListSkeleton from './skeletons/ChatListSkeleton';
import Icon from './ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatListItem extends Contact {
    lastMessage?: string;
    lastMessageAt?: string;
}

interface ChatListProps {
    socket: Socket | null;
    activeContactId: string | null;
    onSelectChat: (contact: Contact) => void;
}

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};


const ChatList: React.FC<ChatListProps> = ({ socket, activeContactId, onSelectChat }) => {
    const [chats, setChats] = useState<ChatListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const filterRef = useRef<HTMLDivElement>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    const fetchChats = useCallback(async (cursor: string | null = null, tags: string[] = []) => {
        setLoading(true);
        try {
            const tagsQuery = tags.length > 0 ? `&tags=${tags.join(',')}` : '';
            const url = `/api/contacts?limit=20${cursor ? `&cursor=${cursor}` : ''}${tagsQuery}`;
            const res = await fetch(url);
            if (res.ok) {
                const { contacts: data, nextCursor: newNextCursor } = await res.json();

                if (cursor) {
                    setChats(prev => [...prev, ...data]);
                } else {
                    setChats(data);
                }

                setNextCursor(newNextCursor);
                setHasMore(!!newNextCursor);
            }
        } catch (error) {
            console.error("Failed to fetch chats", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats(null, selectedTagIds);
    }, [selectedTagIds, fetchChats]);

    const lastChatElementRef = useCallback((node: HTMLLIElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && nextCursor) {
                fetchChats(nextCursor, selectedTagIds);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, nextCursor, fetchChats, selectedTagIds]);

    useEffect(() => {
        const fetchTags = async () => {
            const res = await fetch('/api/tags');
            if (res.ok) setAllTags(await res.json());
        };
        fetchTags();

        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (socket) {
            const handleNewMessage = (newMessage: Message) => {
                setChats(prevChats => {
                    const contactId = newMessage.contactId;
                    if (!contactId) return prevChats;

                    const isForActiveContact = contactId === activeContactId;
                    let contactExists = false;

                    const updatedChats = prevChats.map(chat => {
                        if (chat.id === contactId) {
                            contactExists = true;
                            return {
                                ...chat,
                                lastMessage: newMessage.text || (newMessage.type !== 'text' ? `Sent a ${newMessage.type}` : ''),
                                lastMessageAt: newMessage.createdAt,
                                unreadCount: isForActiveContact ? 0 : (chat.unreadCount || 0) + (newMessage.from === 'customer' ? 1 : 0),
                            };
                        }
                        return chat;
                    });

                    if (!contactExists) {
                        Promise.resolve().then(() => fetchChats(null, selectedTagIds));
                        return prevChats;
                    }

                    return updatedChats.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
                });
            };

            socket.on('newMessage', handleNewMessage);
            return () => { socket.off('newMessage', handleNewMessage); };
        }
    }, [socket, activeContactId, fetchChats, selectedTagIds]);

    const handleSelectTag = (tagId: string) => {
        setSelectedTagIds(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full md:w-80 border-r flex flex-col h-full bg-white dark:bg-[var(--sidebar-background)] border-gray-200 dark:border-[var(--card-border)]">
            <div className="p-4 border-b border-gray-200 dark:border-[var(--card-border)]">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Chats</h2>
                <div className="flex items-center space-x-2 mt-3">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--incoming-bubble-bg)] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                    <div className="relative" ref={filterRef}>
                        <button onClick={() => setIsFilterOpen(prev => !prev)} className={`p-2 border rounded-md ${selectedTagIds.length > 0 ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50' : 'bg-gray-50 dark:bg-[var(--incoming-bubble-bg)]'}`}>
                            <Icon name="SlidersHorizontal" size={20} />
                        </button>
                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-20">
                                <div className="p-2 text-sm font-semibold border-b dark:border-gray-700">Filter by Tag</div>
                                <div className="p-2 max-h-48 overflow-y-auto">
                                    {allTags.map(tag => (
                                        <label key={tag.id} className="flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <input type="checkbox" checked={selectedTagIds.includes(tag.id)} onChange={() => handleSelectTag(tag.id)} className="h-4 w-4 text-blue-600 rounded" />
                                            <span>{tag.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {selectedTagIds.length > 0 && (
                                    <div className="p-2 border-t dark:border-gray-700">
                                        <button onClick={() => setSelectedTagIds([])} className="w-full text-center text-xs text-red-500 hover:underline">Clear Filters</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {loading && chats.length === 0 ? <ChatListSkeleton /> : (
                    <motion.ul variants={listVariants} initial="hidden" animate="visible">
                        <AnimatePresence>
                            {filteredChats.map((chat, index) => (
                                <motion.li
                                    ref={index === filteredChats.length - 1 ? lastChatElementRef : null}
                                    key={chat.id}
                                    variants={itemVariants}
                                    exit="exit"
                                    onClick={() => onSelectChat(chat)}
                                    className={`p-3 cursor-pointer border-b border-gray-200 dark:border-[var(--card-border)] hover:bg-gray-50 dark:hover:bg-[var(--input-background)] transition-colors ${activeContactId === chat.id ? 'bg-blue-50 dark:bg-[var(--incoming-bubble-bg)]' : ''}`}
                                >
                                    <div className="flex items-start">
                                        <Avatar initials={(chat.name || '?').charAt(0).toUpperCase()} />
                                        <div className="ml-3 flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-sm truncate text-gray-800 dark:text-gray-100">{chat.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                                    {chat.lastMessageAt && formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-start mt-1">
                                                <p className="text-xs text-gray-600 dark:text-gray-300 truncate pr-2">{chat.lastMessage || 'No messages yet'}</p>
                                                {chat.unreadCount && chat.unreadCount > 0 && (
                                                    <span className="bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-1 mt-2 overflow-hidden">
                                                {chat.tags?.map(tag => (
                                                    <div key={tag.id} className="px-1.5 py-0.5 text-[10px] font-medium rounded" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                                                        {tag.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                        {loading && chats.length > 0 && <p className="p-4 text-sm text-gray-500 dark:text-gray-300 text-center">Loading more...</p>}
                    </motion.ul>
                )}
            </div>
        </div>
    );
};

export default ChatList;