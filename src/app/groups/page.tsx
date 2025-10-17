"use client";

import React, { useState, useEffect } from 'react';
import { Users, Plus, Loader2, Trash2, Edit, HelpCircle, MessageSquare } from 'lucide-react';
// FIX: Corrected import path for types to use a relative path.
import type { Group } from '../../types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AddGroupModal from '../../components/groups/AddGroupModel';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const GroupsPage = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/groups');
            if (res.ok) {
                const data = await res.json();
                setGroups(data);
            }
        } catch (error) {
            console.error("Failed to fetch groups", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const openModal = (group: Group | null = null) => {
        setGroupToEdit(group);
        setIsModalOpen(true);
    };

    const handleSaveSuccess = () => {
        setIsModalOpen(false);
        setGroupToEdit(null);
        fetchGroups();
    };

    const handleDelete = async (groupId: string) => {
        if (window.confirm('Are you sure you want to unregister this group? This will not affect the group on WhatsApp.')) {
            await fetch(`/api/groups/${groupId}`, { method: 'DELETE' });
            fetchGroups();
        }
    };

    if (loading) {
        return <div className="p-8 text-center flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }

    return (
        <div className="p-6 md:p-8 dark:bg-gray-900/50 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">WhatsApp Groups</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and communicate with your registered WhatsApp groups.</p>
                </div>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center shadow-sm hover:bg-blue-700">
                    <Plus size={16} className="mr-2" /> Register Group
                </button>
            </div>

            {groups.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <Users size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">No Groups Registered</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click 'Register Group' to start managing a WhatsApp group.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <div key={group.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{group.name}</h3>
                                    <div className="flex space-x-1">
                                        <button onClick={() => openModal(group)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(group.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1 break-all">{group.whatsappGroupId}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                    Last message: {group.lastMessageAt ? formatDistanceToNow(new Date(group.lastMessageAt), { addSuffix: true }) : 'Never'}
                                </p>
                            </div>
                            <div className="mt-4">
                                <Link href={`/groups/${group.id}`} className="w-full bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm font-semibold hover:bg-green-600">
                                    <MessageSquare size={16} className="mr-2" /> Open Chat
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <AddGroupModal
                    group={groupToEdit}
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setGroupToEdit(null); }}
                    onSuccess={handleSaveSuccess}
                />
            )}
        </div>
    );
};

export default GroupsPage;