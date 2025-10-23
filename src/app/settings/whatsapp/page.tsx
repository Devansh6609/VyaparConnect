"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Loader2, AlertCircle, HelpCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';

interface WhatsAppSettings {
    whatsappPhoneNumberId?: string;
    whatsappBusinessAccountId?: string;
    whatsappAccessToken?: string;
    hasVerifyToken?: boolean;
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const WhatsAppSettingsPage = () => {
    const { data: session } = useSession();
    const [settings, setSettings] = useState<WhatsAppSettings>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [isLocalhost, setIsLocalhost] = useState(false);

    // State for secure token reveal
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [verifyPassword, setVerifyPassword] = useState('');
    const [verifyError, setVerifyError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [revealedToken, setRevealedToken] = useState<string | null>(null);

    useEffect(() => {
        const origin = window.location.origin;
        if (session?.user?.id) {
            setWebhookUrl(`${origin}/api/webhooks/whatsapp?uid=${session.user.id}`);
        }
        setIsLocalhost(origin.includes('localhost') || origin.includes('127.0.0.1'));

        const fetchSettings = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/settings/whatsapp');
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
    }, [session?.user?.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/settings/whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to save settings.');
            }
            setSettings(data);
            setSuccess('Settings saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleVerifyAndShowToken = async () => {
        setIsVerifying(true);
        setVerifyError('');
        try {
            const res = await fetch('/api/settings/reveal-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: verifyPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Verification failed');
            setRevealedToken(data.token);
            setIsVerifyModalOpen(false);
            setVerifyPassword('');
        } catch (err: any) {
            setVerifyError(err.message);
        } finally {
            setIsVerifying(false);
        }
    };

    const copyToClipboard = (text: string, elementId: string) => {
        navigator.clipboard.writeText(text);
        const element = document.getElementById(elementId);
        if (element) {
            const originalText = element.innerText;
            element.innerText = 'Copied!';
            setTimeout(() => {
                element.innerText = originalText;
            }, 1500);
        }
    };


    if (loading) {
        return <div className="p-8 flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
            <Link href="/settings" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Settings</Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">WhatsApp Setup</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Connect your WhatsApp Business Account to start messaging.</p>

            <div className="mt-8 max-w-4xl mx-auto space-y-8">
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

                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 1: Enter Your API Credentials</h2>
                    <div className="p-3 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-md text-sm flex items-start mb-4">
                        <HelpCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Find these credentials in your <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" className="font-bold underline">Meta for Developers App</a> under <code className="bg-black/10 px-1 rounded">WhatsApp &gt; API Setup</code>.</span>
                    </div>
                    <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Phone Number ID</label>
                            <input type="text" name="whatsappPhoneNumberId" value={settings.whatsappPhoneNumberId || ''} onChange={handleInputChange} className="w-full border rounded-md p-2 mt-1 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Business Account ID</label>
                            <input type="text" name="whatsappBusinessAccountId" value={settings.whatsappBusinessAccountId || ''} onChange={handleInputChange} className="w-full border rounded-md p-2 mt-1 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Permanent Access Token</label>
                            <input
                                type="password"
                                name="whatsappAccessToken"
                                value={settings.whatsappAccessToken || ''}
                                onChange={handleInputChange}
                                onFocus={(e) => {
                                    if (e.target.value.startsWith('•')) {
                                        setSettings(prev => ({ ...prev, whatsappAccessToken: '' }));
                                    }
                                }}
                                placeholder="Enter a new token to update it"
                                className="w-full border rounded-md p-2 mt-1 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={saving} className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">
                                {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                {saving ? 'Saving...' : 'Save Credentials'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 2: Configure Webhook in Meta</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Copy the following values and paste them into your Meta App's webhook configuration page.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Callback URL</label>
                            <div className="flex items-center mt-1">
                                <input type="text" value={webhookUrl} readOnly className="w-full border rounded-l-md p-2 bg-gray-100 dark:bg-gray-700/50 font-mono text-xs" />
                                <button type="button" id="copy-url-btn" onClick={() => copyToClipboard(webhookUrl, 'copy-url-btn')} className="p-2 border border-l-0 rounded-r-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"><Copy size={16} /></button>
                            </div>
                            {isLocalhost && (
                                <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-md text-sm flex items-start">
                                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Action Required:</strong> You are on a local server. Meta's webhooks cannot reach this URL. Use a tunneling service like <a href="https://ngrok.com/" target="_blank" rel="noopener noreferrer" className="font-bold underline">ngrok</a> to get a public HTTPS URL. Then, paste that public URL (e.g., <code>https://&lt;your-ngrok-id&gt;.ngrok.io/api/webhooks/whatsapp?uid={session?.user.id}</code>) into your Meta App's webhook configuration.
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Verify Token</label>
                            <div className="flex items-center mt-1">
                                <input type="text" value={revealedToken || '••••••••••••••••••••••••••••••••••••'} readOnly className="w-full border rounded-l-md p-2 bg-gray-100 dark:bg-gray-700/50 font-mono text-xs" />
                                {revealedToken ? (
                                    <button type="button" onClick={() => setRevealedToken(null)} className="p-2 border border-l-0 rounded-r-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"><EyeOff size={16} /></button>
                                ) : (
                                    <button type="button" onClick={() => setIsVerifyModalOpen(true)} className="p-2 border border-l-0 rounded-r-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"><Eye size={16} /></button>
                                )}
                                <button type="button" id="copy-token-btn" onClick={() => revealedToken && copyToClipboard(revealedToken, 'copy-token-btn')} disabled={!revealedToken} className="p-2 border border-l-0 rounded-r-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"><Copy size={16} /></button>
                            </div>
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/30 border dark:border-gray-700 rounded-md text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                <p className="font-semibold">Next Steps:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Copy the user-specific <span className="font-bold">Callback URL</span> above.</li>
                                    <li>Click the <Eye size={14} className="inline-block mx-1" /> icon, enter your password to reveal your secure <span className="font-bold">Verify Token</span>, then copy it.</li>
                                    <li>Paste both values into their corresponding fields in your Meta App's webhook configuration.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Modal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} title="Enter Password to Reveal Token">
                <div className="space-y-4">
                    {verifyError && <p className="text-red-500 text-sm">{verifyError}</p>}
                    <p className="text-sm text-gray-600 dark:text-gray-400">For your security, please enter your login password to continue.</p>
                    <input
                        type="password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Your password"
                    />
                    <div className="flex justify-end">
                        <button onClick={handleVerifyAndShowToken} disabled={isVerifying} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {isVerifying ? <Loader2 className="animate-spin mr-2" /> : null}
                            Verify
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WhatsAppSettingsPage;