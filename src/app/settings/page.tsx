// src/app/settings/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Building, Landmark, KeyRound, Save, Loader2, AlertCircle, Palette, MessageCircle, Briefcase, Image } from 'lucide-react';
import { motion } from 'framer-motion';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SingleImageUploader from '@/components/settings/SingleImageUploader';
import Link from 'next/link';
// FIX: Import Icon component to resolve reference errors.
import Icon from '@/components/ui/Icon';

// Define types locally to avoid module resolution issues
type WorkflowType = 'QUOTATION_FOCUSED' | 'ORDER_FOCUSED' | 'HYBRID';

interface SettingsData {
    companyName?: string;
    companyAddress?: string;
    companyLogoUrl?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankIfscCode?: string;
    upiQrCodeUrl?: string;
    razorpayKeyId?: string;
    razorpayKeySecret?: string;
    primaryWorkflow?: WorkflowType;
    geminiApiKey?: string;
    imgbbApiKey?: string; // Added ImgBB API key
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.07 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};


const SettingsPage = () => {
    const [settings, setSettings] = useState<SettingsData>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/settings');
                if (!res.ok) throw new Error('Failed to load settings.');
                const data = await res.json();
                setSettings(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleUpload = (field: keyof SettingsData, url: string) => {
        setSettings(prev => ({ ...prev, [field]: url }));
    };

    const handleWorkflowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, primaryWorkflow: e.target.value as WorkflowType }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save settings.');
            }
            const savedSettings = await res.json();
            // Update state with placeholders for API keys if they were saved
            setSettings(prev => ({
                ...prev,
                geminiApiKey: savedSettings.geminiApiKey,
                imgbbApiKey: savedSettings.imgbbApiKey,
            }));
            setSuccess('Settings saved successfully! Please re-login to see workspace changes.');
            setTimeout(() => setSuccess(''), 5000); // Hide after 5s
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
            <motion.div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your company profile, payment details, and integrations.</p>
            </motion.div>

            <motion.form
                onSubmit={handleSubmit}
                className="mt-8 max-w-4xl mx-auto space-y-8"
            // FIX: Removed framer-motion props (`variants`, `initial`, `animate`) due to TypeScript error. This may affect animations.
            >
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
                        <AlertCircle className="h-5 w-5 mr-3" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
                        <p>{success}</p>
                    </div>
                )}

                {/* Workspace Settings Card */}
                <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"><Briefcase className="mr-2 text-orange-600" /> Workspace</h2>
                    <div className="space-y-3">
                        <label className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${settings.primaryWorkflow === 'QUOTATION_FOCUSED' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                            <input type="radio" name="primaryWorkflow" value="QUOTATION_FOCUSED" checked={settings.primaryWorkflow === 'QUOTATION_FOCUSED'} onChange={handleWorkflowChange} className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <div>
                                <p className="font-medium text-gray-800 dark:text-gray-100">Quotation Focused</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Best for businesses selling custom goods or high-value services that require estimates.</p>
                            </div>
                        </label>
                        <label className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${settings.primaryWorkflow === 'ORDER_FOCUSED' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                            <input type="radio" name="primaryWorkflow" value="ORDER_FOCUSED" checked={settings.primaryWorkflow === 'ORDER_FOCUSED'} onChange={handleWorkflowChange} className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <div>
                                <p className="font-medium text-gray-800 dark:text-gray-100">Order Focused</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Ideal for businesses selling standard products at fixed prices, like food or small goods.</p>
                            </div>
                        </label>
                        <label className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${settings.primaryWorkflow === 'HYBRID' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                            <input type="radio" name="primaryWorkflow" value="HYBRID" checked={settings.primaryWorkflow === 'HYBRID'} onChange={handleWorkflowChange} className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <div>
                                <p className="font-medium text-gray-800 dark:text-gray-100">Hybrid</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">For businesses that do a mix of both. Shows Quotations and Orders with equal importance.</p>
                            </div>
                        </label>
                    </div>
                </motion.div>

                {/* Appearance Card */}
                <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"><Palette className="mr-2 text-indigo-600" /> Appearance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                        <label htmlFor="theme" className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                        <div className="md:col-span-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </motion.div>

                {/* WhatsApp Setup Card */}
                <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center"><MessageCircle className="mr-2 text-green-600" /> WhatsApp Integration</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Connect your WhatsApp Business account to enable messaging, webhooks, and automation.</p>
                    <div className="flex justify-end">
                        <Link href="/settings/whatsapp" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 text-sm">
                            Configure WhatsApp
                        </Link>
                    </div>
                </motion.div>

                {/* Company Profile Card */}
                <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"><Building className="mr-2 text-blue-600" /> Company Profile</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                            <input id="companyName" type="text" name="companyName" value={settings.companyName || ''} onChange={handleInputChange} className="md:col-span-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-2">
                            <label htmlFor="companyAddress" className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-2 md:pt-0">Company Address</label>
                            <textarea id="companyAddress" name="companyAddress" value={settings.companyAddress || ''} onChange={handleInputChange} rows={3} className="md:col-span-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-2 md:pt-0">Company Logo</label>
                            <div className="md:col-span-2">
                                <SingleImageUploader
                                    initialUrl={settings.companyLogoUrl}
                                    onUpload={(url) => handleUpload('companyLogoUrl', url)}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Payment Details Card */}
                <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"><Landmark className="mr-2 text-green-600" /> Payment Details</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="bankName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
                            <input id="bankName" type="text" name="bankName" value={settings.bankName || ''} onChange={handleInputChange} className="md:col-span-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="bankAccountNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
                            <input id="bankAccountNumber" type="text" name="bankAccountNumber" value={settings.bankAccountNumber || ''} onChange={handleInputChange} className="md:col-span-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="bankIfscCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">IFSC Code</label>
                            <input id="bankIfscCode" type="text" name="bankIfscCode" value={settings.bankIfscCode || ''} onChange={handleInputChange} className="md:col-span-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-2 md:pt-0">UPI QR Code</label>
                            <div className="md:col-span-2">
                                <SingleImageUploader
                                    initialUrl={settings.upiQrCodeUrl}
                                    onUpload={(url) => handleUpload('upiQrCodeUrl', url)}
                                    isQrCode
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* API Integrations Card */}
                <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"><KeyRound className="mr-2 text-purple-600" /> API Integrations</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="imgbbApiKey" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <Icon name="image" size={16} className="mr-2" /> ImgBB API Key
                            </label>
                            <input
                                id="imgbbApiKey"
                                type="password"
                                name="imgbbApiKey"
                                value={settings.imgbbApiKey || ''}
                                onChange={handleInputChange}
                                onFocus={(e) => {
                                    if (e.target.value.startsWith('•')) {
                                        setSettings(prev => ({ ...prev, imgbbApiKey: '' }));
                                    }
                                }}
                                placeholder="Enter your ImgBB API Key"
                                className="md:col-span-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="geminiApiKey" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <Icon name="sparkles" size={16} className="mr-2" /> Gemini API Key
                            </label>
                            <input
                                id="geminiApiKey"
                                type="password"
                                name="geminiApiKey"
                                value={settings.geminiApiKey || ''}
                                onChange={handleInputChange}
                                onFocus={(e) => {
                                    if (e.target.value.startsWith('•')) {
                                        setSettings(prev => ({ ...prev, geminiApiKey: '' }));
                                    }
                                }}
                                placeholder="Enter your Gemini API Key"
                                className="md:col-span-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="razorpayKeyId" className="text-sm font-medium text-gray-700 dark:text-gray-300">Razorpay Key ID</label>
                            <input id="razorpayKeyId" type="text" name="razorpayKeyId" value={settings.razorpayKeyId || ''} onChange={handleInputChange} className="md:col-span-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                            <label htmlFor="razorpayKeySecret" className="text-sm font-medium text-gray-700 dark:text-gray-300">Razorpay Key Secret</label>
                            <input id="razorpayKeySecret" type="password" name="razorpayKeySecret" value={settings.razorpayKeySecret || ''} onChange={handleInputChange} className="md:col-span-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                        </div>
                    </div>
                </motion.div>

                <motion.div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={saving} className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            {saving ? 'Saving...' : 'Save All Settings'}
                        </button>
                    </div>
                </motion.div>
            </motion.form>
        </div>
    );
};

export default SettingsPage;