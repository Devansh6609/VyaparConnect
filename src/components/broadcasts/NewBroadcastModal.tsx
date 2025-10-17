"use client";
import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import type { Tag } from '../../types';
import { Loader2, Send, HelpCircle, AlertTriangle } from 'lucide-react';
import SingleImageUploader from '../settings/SingleImageUploader';

interface NewBroadcastModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const NewBroadcastModal: React.FC<NewBroadcastModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [templateId, setTemplateId] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchTags = async () => {
                const res = await fetch('/api/tags');
                if (res.ok) setAllTags(await res.json());
            };
            fetchTags();
            // Reset state on open
            setSelectedTagIds([]);
            setMessage('');
            setTemplateId('');
            setError('');
            setImageUrl(null);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTagIds.length === 0) {
            setError("Please select at least one target tag.");
            return;
        }
        if (!imageUrl && !templateId) {
            setError("A Template Name is required for text-only broadcasts.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/broadcasts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tagIds: selectedTagIds, message, templateId, imageUrl }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send broadcast.');
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Broadcast">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600 bg-red-50 p-2 rounded-md text-sm">{error}</p>}

                <div className="p-3 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-md text-sm flex items-start">
                    <AlertTriangle className="w-8 h-8 mr-2 flex-shrink-0" />
                    <span><b>Important:</b> To comply with WhatsApp policies, you must send a pre-approved Meta Template Message for text-only broadcasts.</span>
                </div>

                <div>
                    <label className="block text-sm font-medium">Target Audience (Tags)</label>
                    <div className="mt-2 border rounded-md max-h-32 overflow-y-auto p-2 space-y-1">
                        {allTags.map(tag => (
                            <label key={tag.id} className="flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedTagIds.includes(tag.id)}
                                    onChange={() => setSelectedTagIds(p => p.includes(tag.id) ? p.filter(id => id !== tag.id) : [...p, tag.id])}
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="text-sm">{tag.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Image (Optional)</label>
                    <div className="mt-1">
                        <SingleImageUploader onUpload={(url) => setImageUrl(url)} initialUrl={imageUrl} />
                    </div>
                </div>

                <div>
                    <label htmlFor="template-id" className="flex items-center text-sm font-medium">Template Name / ID</label>
                    <input id="template-id" type="text" value={templateId} onChange={e => setTemplateId(e.target.value)} required={!imageUrl} className="mt-1 w-full border rounded-md p-2 text-sm dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., hello_world (required if no image)" />
                </div>

                <div>
                    <label htmlFor="message" className="text-sm font-medium">Message Content / Caption</label>
                    <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={4} required className="mt-1 w-full border rounded-md p-2 text-sm dark:bg-gray-700 dark:border-gray-600" placeholder={imageUrl ? "Enter a caption for your image..." : "This message text must EXACTLY match your approved template content."} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm border dark:border-gray-600 rounded-md">Cancel</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center">
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
                        Send Broadcast
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default NewBroadcastModal;