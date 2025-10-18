"use client";

// FIX: Add missing React import to resolve namespace error for React.FormEvent
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError('Invalid email or password. Please try again.');
            setLoading(false);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to continue to VyaparConnect</p>
                </div>
                {error && <p className="text-sm text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}