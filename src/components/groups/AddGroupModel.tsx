// src/components/groups/AddGroupModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import type { Group } from '../../types';
import { Loader2, HelpCircle } from 'lucide-react';

interface AddGroupModalProps {
    group: Group | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ group, isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [whatsappGroupId, setWhatsappGroupId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (group) {
                setName(group.name);
                setWhatsappGroupId(group.whatsappGroupId);
            } else {
                setName('');
                setWhatsappGroupId('');
            }
            setError(''); // Reset error when modal opens
        }
    }, [group, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const method = group ? 'PUT' : 'POST';
            const url = group ? `/api/groups/${group.id}` : '/api/groups';
            // Only send `name` on PUT, as group ID should be immutable
            const body = group ? { name } : { name, whatsappGroupId };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to save group.');
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={group ? 'Edit Group' : 'Register New Group'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-md text-sm">{error}</p>}

                <div>
                    <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Group Display Name
                    </label>
                    <input
                        id="group-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 w-full border rounded-md p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                        placeholder="e.g., Daily Food Specials"
                    />
                </div>

                <div>
                    <label htmlFor="group-id" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        WhatsApp Group ID
                        <div className="group relative ml-2">
                            <HelpCircle size={14} className="text-gray-400" />
                            <div className="absolute bottom-full mb-2 w-64 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                To get the Group ID, temporarily add your business number to the group, send any message, and check your webhook logs for the 'from' field (e.g., '12345-67890@g.us').
                            </div>
                        </div>
                    </label>
                    <input
                        id="group-id"
                        type="text"
                        value={whatsappGroupId}
                        onChange={(e) => setWhatsappGroupId(e.target.value)}
                        required
                        disabled={!!group} // Can't edit group ID after creation
                        className="mt-1 w-full border rounded-md p-2 text-sm font-mono disabled:bg-gray-100 dark:disabled:bg-gray-800/50 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="e.g., 1234567890-12345678@g.us"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm border dark:border-gray-600 rounded-md">Cancel</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center">
                        {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                        {loading ? 'Saving...' : 'Save Group'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddGroupModal;