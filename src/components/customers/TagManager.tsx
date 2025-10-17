"use client";
import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types to use a path alias.
import type { Tag as TagType } from '../../types';
import Tag from '../ui/Tag';
import { Plus } from 'lucide-react';

interface TagManagerProps {
    tags: TagType[];
    onTagsChange: (tags: TagType[]) => void;
}

const COLORS = [
    '#3b82f6', '#22c55e', '#eab308', '#f97316',
    '#ef4444', '#8b5cf6', '#d946ef', '#64748b',
];

const TagManager: React.FC<TagManagerProps> = ({ tags, onTagsChange }) => {
    const [allTags, setAllTags] = useState<TagType[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(COLORS[0]);
    const [error, setError] = useState('');

    const fetchAllTags = async () => {
        const res = await fetch('/api/tags');
        if (res.ok) setAllTags(await res.json());
    };

    useEffect(() => {
        fetchAllTags();
    }, []);

    const handleAddTag = (tagId: string) => {
        if (!tagId) return;
        const tagToAdd = allTags.find(t => t.id === tagId);
        if (tagToAdd && !tags.some(t => t.id === tagId)) {
            onTagsChange([...tags, tagToAdd]);
        }
    };

    const handleRemoveTag = (tagId: string) => {
        onTagsChange(tags.filter(t => t.id !== tagId));
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) {
            setError("Tag name cannot be empty.");
            return;
        }
        setError('');
        try {
            const res = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTagName, color: newTagColor }),
            });
            const newTag = await res.json();
            if (!res.ok) {
                throw new Error(newTag.error || 'Failed to create tag.');
            }

            await fetchAllTags(); // Refresh the global list of tags
            onTagsChange([...tags, newTag]); // Add the new tag to the contact

            setNewTagName('');
            setNewTagColor(COLORS[0]);
            setIsCreating(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const availableTags = allTags.filter(
        (t) => !tags.some((ct) => ct.id === t.id)
    );

    return (
        <div className="p-3 border dark:border-gray-700 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">Tags</h4>
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
            <div className="flex flex-wrap gap-2 items-center">
                {tags.map(tag => (
                    <Tag key={tag.id} name={tag.name} color={tag.color} onRemove={() => handleRemoveTag(tag.id)} />
                ))}

                {!isCreating && (
                    <button type="button" onClick={() => setIsCreating(true)} className="flex items-center text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50">
                        <Plus size={12} className="mr-1" /> Add Tag
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="mt-3 space-y-2 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                    {availableTags.length > 0 && (
                        <select onChange={(e) => { handleAddTag(e.target.value); e.target.value = ""; }} className="w-full border rounded-md p-1.5 text-sm dark:bg-gray-700 dark:border-gray-600" defaultValue="">
                            <option value="" disabled>Add existing tag...</option>
                            {availableTags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
                        </select>
                    )}
                    <p className="text-xs text-center text-gray-500">Or</p>
                    <div className="flex items-center gap-2">
                        <input value={newTagName} onChange={e => { setNewTagName(e.target.value); setError(''); }} placeholder="Create new tag..." className="flex-1 border rounded-md p-1.5 text-sm dark:bg-gray-700 dark:border-gray-600" />
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-md">
                            {COLORS.map(color => <button key={color} type="button" onClick={() => setNewTagColor(color)} style={{ backgroundColor: color }} className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${newTagColor === color ? 'ring-2 ring-offset-1 dark:ring-offset-gray-800 ring-blue-500' : ''}`} />)}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                        <button type="button" onClick={() => { setIsCreating(false); setError(''); }} className="px-3 py-1 border rounded-md dark:border-gray-600">Cancel</button>
                        <button type="button" onClick={handleCreateTag} className="bg-blue-600 text-white px-3 py-1 rounded-md">Create & Add</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagManager;