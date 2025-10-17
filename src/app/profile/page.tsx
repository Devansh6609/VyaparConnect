

"use client";
import React, { useState, useEffect } from 'react';
import { UserCog, Lock, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface UserProfile {
    name: string;
    email: string;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};


const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [name, setName] = useState('');
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [infoSaving, setInfoSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [error, setError] = useState<{ form: 'info' | 'password', message: string } | null>(null);
    const [success, setSuccess] = useState<{ form: 'info' | 'password', message: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/profile');
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to load profile.');
                }
                const data = await res.json();
                setProfile(data);
                setName(data.name);
            } catch (err: any) {
                setError({ form: 'info', message: err.message });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInfoSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update profile.');
            setProfile(data);
            setSuccess({ form: 'info', message: 'Profile updated successfully!' });
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError({ form: 'info', message: err.message });
        } finally {
            setInfoSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError({ form: 'password', message: "New passwords do not match." });
            return;
        }
        setPasswordSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to change password.');
            setSuccess({ form: 'password', message: 'Password changed successfully!' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError({ form: 'password', message: err.message });
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-gray-900/50 min-h-full">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
            >
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and password.</p>
            </motion.div>

            <motion.div
                className="mt-8 max-w-4xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Personal Information Card */}
                <motion.form
                    onSubmit={handleInfoSubmit}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50"
                    variants={itemVariants}
                >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"><UserCog className="mr-2 text-blue-600" /> Personal Information</h2>
                    {error?.form === 'info' && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error.message}</div>
                    )}
                    {success?.form === 'info' && (
                        <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm mb-4">{success.message}</div>
                    )}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="md:col-span-2 mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input id="email" type="email" value={profile?.email || ''} readOnly disabled className="md:col-span-2 mt-1 w-full border rounded-md px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed border-gray-300 dark:border-gray-600" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 mt-2">
                        <button type="submit" disabled={infoSaving} className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {infoSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            {infoSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </motion.form>

                {/* Change Password Card */}
                <motion.form
                    onSubmit={handlePasswordSubmit}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50"
                    variants={itemVariants}
                >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"><Lock className="mr-2 text-purple-600" /> Change Password</h2>
                    {error?.form === 'password' && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error.message}</div>
                    )}
                    {success?.form === 'password' && (
                        <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm mb-4">{success.message}</div>
                    )}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                            <input id="currentPassword" type="password" value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} className="md:col-span-2 mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                            <input id="newPassword" type="password" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} className="md:col-span-2 mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                            <input id="confirmPassword" type="password" value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="md:col-span-2 mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" required />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 mt-2">
                        <button type="submit" disabled={passwordSaving} className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {passwordSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            {passwordSaving ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default ProfilePage;