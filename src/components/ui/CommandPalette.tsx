// src/components/ui/CommandPalette.tsx
"use client";

import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useCommandK, openCommandPalette } from '@/hooks/useCommandK';
// FIX: Used type-only import to prevent module resolution errors.
import type { Contact, Product } from '@/types';
import { Search, Package, User, FileText, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

type CommandItem = {
    id: string;
    type: 'contact' | 'product' | 'action';
    name: string;
    description?: string;
    icon: React.ReactNode;
    action: () => void;
};

export default function CommandPalette() {
    const { isOpen, setIsOpen } = useCommandK();
    const [query, setQuery] = useState('');
    const [items, setItems] = useState<CommandItem[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            fetchData();
        } else {
            setQuery('');
            setActiveIndex(0);
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const [contactsRes, productsRes] = await Promise.all([
                fetch('/api/contacts'),
                fetch('/api/products')
            ]);
            const { contacts } = await contactsRes.json();
            const products = await productsRes.json();

            const contactItems: CommandItem[] = (contacts || []).map((c: Contact) => ({
                id: c.id,
                type: 'contact',
                name: c.name,
                description: c.phone,
                icon: <Avatar initials={c.name.charAt(0)} className="w-6 h-6 text-xs" />,
                action: () => router.push(`/chat?contactId=${c.id}`)
            }));

            const productItems: CommandItem[] = (products || []).map((p: Product) => ({
                id: p.id,
                type: 'product',
                name: p.name,
                description: `₹${p.price}`,
                icon: <Package size={20} />,
                action: () => {
                    // This action is more complex, maybe open it in a modal later
                    // For now, let's just log it. Or maybe we can open right panel?
                    console.log(`Selected product: ${p.name}`);
                }
            }));

            const actionItems: CommandItem[] = [
                {
                    id: 'settings', type: 'action', name: 'Settings',
                    description: 'Manage application settings',
                    icon: <Settings size={20} />,
                    action: () => router.push('/settings')
                },
                {
                    id: 'transactions', type: 'action', name: 'Transactions',
                    description: 'View all transactions',
                    icon: <FileText size={20} />,
                    action: () => router.push('/transactions')
                }
            ];

            setItems([...contactItems, ...productItems, ...actionItems]);
        } catch (error) {
            console.error("Failed to fetch command palette data", error);
        }
    };

    const filteredItems = query
        ? items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase()))
        : items;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedItem = filteredItems[activeIndex];
            if (selectedItem) {
                selectedItem.action();
                setIsOpen(false);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                        onKeyDown={handleKeyDown}
                    >
                        <div className="flex items-center px-4 border-b dark:border-gray-700">
                            <Search className="text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
                                placeholder="Search contacts, products, or actions..."
                                className="w-full bg-transparent p-4 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
                            />
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                                <X />
                            </button>
                        </div>
                        <ul className="max-h-96 overflow-y-auto p-2">
                            {filteredItems.map((item, index) => (
                                <li
                                    key={item.id}
                                    onClick={() => { item.action(); setIsOpen(false); }}
                                    className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${index === activeIndex ? 'bg-blue-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                                    <div>
                                        <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{item.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                                    </div>
                                </li>
                            ))}
                            {filteredItems.length === 0 && (
                                <li className="text-center p-4 text-sm text-gray-500">No results found.</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}