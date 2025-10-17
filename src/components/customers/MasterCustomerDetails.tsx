
"use client";

import React, { useState, useEffect } from 'react';
import type { Contact, ContactDetails, Tag as TagType } from '../../types';
import { Save, Loader2, Star, Edit as EditIcon, UserX } from 'lucide-react';
import TagManager from './TagManager';
import Tag from '../ui/Tag';
import Icon from '../ui/Icon';
import { motion } from 'framer-motion';

interface MasterCustomerDetailsProps {
    contact: Contact;
    onPromoted: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
};


const MasterCustomerDetails: React.FC<MasterCustomerDetailsProps> = ({ contact, onPromoted }) => {
    const [detailedContact, setDetailedContact] = useState<ContactDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form state for editing
    const [formData, setFormData] = useState({
        name: '',
        shippingAddress: '',
        bankDetails: '',
        tags: [] as TagType[],
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isDemoting, setIsDemoting] = useState(false);
    const [error, setError] = useState('');

    const fetchDetails = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/contacts/${contact.id}/details`);
            if (!res.ok) throw new Error("Failed to load details.");
            const data: ContactDetails = await res.json();
            setDetailedContact(data);
            setFormData({
                name: data.name || '',
                shippingAddress: data.shippingAddress || '',
                bankDetails: data.bankDetails || '',
                tags: data.tags || []
            });
            // If the contact is not yet a master customer, immediately go into edit mode.
            // Otherwise, start in read-only mode.
            setIsEditing(!data.isMasterCustomer);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (contact.id) {
            fetchDetails();
        }
    }, [contact.id]);


    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            const res = await fetch(`/api/contacts/${contact.id}/promote-to-master`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    shippingAddress: formData.shippingAddress,
                    bankDetails: formData.bankDetails,
                    tagIds: formData.tags.map(t => t.id)
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save customer details.');
            }
            // After saving, refetch the latest data and exit edit mode
            await fetchDetails();
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDemote = async () => {
        if (!window.confirm("Are you sure you want to remove this customer from master status?")) {
            return;
        }
        setIsDemoting(true);
        setError('');
        try {
            const res = await fetch(`/api/contacts/${contact.id}/demote`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to demote customer.');
            onPromoted(); // Go back or refresh main view
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsDemoting(false);
        }
    };

    const handleCancelEdit = () => {
        if (detailedContact) {
            setFormData({
                name: detailedContact.name || '',
                shippingAddress: detailedContact.shippingAddress || '',
                bankDetails: detailedContact.bankDetails || '',
                tags: detailedContact.tags || []
            });
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="p-4 text-center">
                <Loader2 className="animate-spin inline-block" />
                <p className="text-sm text-gray-500">Loading Details...</p>
            </div>
        );
    }

    if (error && !detailedContact) {
        return <p className="p-4 text-red-600 bg-red-50 text-center">{error}</p>
    }

    if (isEditing) {
        return (
            <motion.form
                onSubmit={handleSaveChanges}
                className="p-4 space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h3 variants={itemVariants} className="font-semibold flex items-center text-yellow-500">
                    <Star size={18} className="mr-2 fill-current" />
                    {detailedContact?.isMasterCustomer ? 'Edit Master Details' : 'Promote to Master Customer'}
                </motion.h3>
                {error && <p className="text-red-600 bg-red-50 p-2 rounded-md text-sm">{error}</p>}

                <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium">Customer Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="mt-1 w-full border rounded-md p-2 text-sm dark:bg-[var(--input-background)] dark:border-gray-600" required />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium">Shipping Address <span className="text-red-500">*</span></label>
                    <textarea value={formData.shippingAddress} onChange={(e) => setFormData(p => ({ ...p, shippingAddress: e.target.value }))} rows={3} className="mt-1 w-full border rounded-md p-2 text-sm dark:bg-[var(--input-background)] dark:border-gray-600" placeholder="Enter full shipping address..." required />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium">Bank Account Details</label>
                    <textarea value={formData.bankDetails} onChange={(e) => setFormData(p => ({ ...p, bankDetails: e.target.value }))} rows={3} className="mt-1 w-full border rounded-md p-2 text-sm dark:bg-[var(--input-background)] dark:border-gray-600" placeholder="Bank Name, Account Number, IFSC Code..." />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <TagManager tags={formData.tags} onTagsChange={(newTags) => setFormData(p => ({ ...p, tags: newTags }))} />
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-end gap-2 pt-2">
                    {detailedContact?.isMasterCustomer && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 text-sm border dark:border-gray-600 rounded-md">Cancel</button>}
                    <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center">
                        {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                        {isSaving ? 'Saving...' : 'Save Details'}
                    </button>
                </motion.div>
            </motion.form>
        );
    }

    // Read-only view
    return (
        <motion.div
            className="p-4 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="space-y-3">
                <motion.div variants={itemVariants}>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tags</label>
                    <div className="flex flex-wrap gap-2 items-center mt-1">
                        {detailedContact?.tags?.map(tag => <Tag key={tag.id} name={tag.name} color={tag.color} />)}
                        {detailedContact?.tags?.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500 italic">No tags</p>}
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Shipping Address</label>
                    <p className="text-sm whitespace-pre-wrap p-2 bg-gray-50 dark:bg-[var(--input-background)] rounded-md mt-1">{detailedContact?.shippingAddress || <span className="italic text-gray-400 dark:text-gray-500">Not provided</span>}</p>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Bank Details</label>
                    <p className="text-sm whitespace-pre-wrap p-2 bg-gray-50 dark:bg-[var(--input-background)] rounded-md mt-1">{detailedContact?.bankDetails || <span className="italic text-gray-400 dark:text-gray-500">Not provided</span>}</p>
                </motion.div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex justify-between items-center pt-2">
                <button
                    type="button"
                    onClick={handleDemote}
                    disabled={isDemoting}
                    className="flex items-center text-xs text-red-500 hover:underline disabled:opacity-50"
                >
                    {isDemoting ? <Loader2 size={14} className="animate-spin mr-1" /> : <Icon name="UserX" size={14} className="mr-1" />}
                    Demote Customer
                </button>
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md flex items-center">
                    <EditIcon size={16} className="mr-2" /> Edit Details
                </button>
            </motion.div>
        </motion.div>
    );
};

export default MasterCustomerDetails;
