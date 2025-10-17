"use client";
import React, { useState, useEffect, useCallback } from 'react';
import type { Broadcast } from '../../types';
import { Plus, Radio, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';
import NewBroadcastModal from '@/components/broadcasts/NewBroadcastModal';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const BroadcastsPage = () => {
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchBroadcasts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/broadcasts');
            if (res.ok) {
                setBroadcasts(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch broadcasts", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBroadcasts();
    }, [fetchBroadcasts]);

    if (loading) {
        return <div className="p-8 text-center flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }

    return (
        <div className="p-6 md:p-8 dark:bg-gray-900/50 min-h-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mb-6"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Broadcasts</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Send campaigns to tagged groups of customers.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center shadow-sm hover:bg-blue-700">
                    <Plus size={16} className="mr-2" /> New Broadcast
                </button>
            </motion.div>

            {broadcasts.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <Radio size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">No Broadcasts Sent</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click 'New Broadcast' to create your first campaign.</p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <motion.tbody
                            className="divide-y dark:divide-gray-700"
                            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence>
                                {broadcasts.map(b => (
                                    <motion.tr
                                        key={b.id}
                                        layout
                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td className="px-4 py-4 whitespace-nowrap"><p className="text-sm truncate max-w-xs">{b.message}</p></td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{b.status}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{b._count?.recipients || 0}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{format(new Date(b.sentAt), 'PPp')}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm"><Link href={`/broadcasts/${b.id}`} className="text-blue-600 hover:underline">View</Link></td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </motion.tbody>
                    </table>
                </motion.div>
            )}

            <NewBroadcastModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchBroadcasts();
                }}
            />
        </div>
    );
};

export default BroadcastsPage;