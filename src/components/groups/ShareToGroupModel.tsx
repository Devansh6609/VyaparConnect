"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
// FIX: Used type-only import to prevent module resolution errors.
import type { Product } from '../../types';
import { Loader2, Send } from 'lucide-react';

interface Group {
    id: string;
    name: string;
}

interface ShareToGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ShareToGroupModal: React.FC<ShareToGroupModalProps> = ({ isOpen, onClose, product }) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sharing, setSharing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && product) {
            const fetchGroups = async () => {
                setLoading(true);
                try {
                    const res = await fetch('/api/groups');
                    if (!res.ok) throw new Error('Failed to fetch groups.');
                    const data = await res.json();
                    setGroups(data);
                } catch (e: any) {
                    setError(e.message);
                } finally {
                    setLoading(false);
                }
            };

            const productDetailsText = `*${product.name}*\n\n*Description:*\n${product.description || "No description available."}\n\n*Price: ₹${product.price.toLocaleString("en-IN")}*`;
            setMessage(productDetailsText);
            fetchGroups();
        } else {
            // Reset state when closed
            setSelectedGroupIds([]);
            setMessage('');
            setError('');
        }
    }, [isOpen, product]);

    const handleGroupToggle = (groupId: string) => {
        setSelectedGroupIds(prev =>
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        );
    };

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGroupIds.length === 0) {
            setError("Please select at least one group.");
            return;
        }
        setSharing(true);
        setError('');
        try {
            const res = await fetch('/api/groups/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product?.id,
                    groupIds: selectedGroupIds,
                    message,
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to share product.');
            }
            onClose(); // Close modal on success
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSharing(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Share "${product?.name}"`}>
            {loading ? <div className="text-center p-4"><Loader2 className="animate-spin inline-block" /></div> : (
                <form onSubmit={handleShare} className="space-y-4">
                    {error && <p className="text-red-600 bg-red-50 p-2 rounded-md text-sm">{error}</p>}

                    <div>
                        <label className="text-sm font-medium">Select Groups</label>
                        <div className="mt-2 border rounded-md max-h-32 overflow-y-auto p-2 space-y-1">
                            {groups.map(group => (
                                <label key={group.id} className="flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedGroupIds.includes(group.id)}
                                        onChange={() => handleGroupToggle(group.id)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{group.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Message</label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={6}
                            className="mt-1 w-full border rounded-md p-2 text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-md">Cancel</button>
                        <button type="submit" disabled={sharing} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center">
                            {sharing && <Loader2 className="animate-spin mr-2" size={16} />}
                            {sharing ? 'Sharing...' : <><Send size={16} className="mr-2" /> Share</>}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default ShareToGroupModal;