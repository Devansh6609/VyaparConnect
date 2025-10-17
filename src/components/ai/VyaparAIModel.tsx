

"use client";
import React, { useState, useRef, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIModal } from '../../context/AiModalContext';
import Icon from '../ui/Icon';
import { Loader2, Send, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Tag } from '../../types';


interface AIMessage {
    role: 'user' | 'assistant';
    content: string;
    type?: 'text' | 'export_ready';
    fileName?: string;
    data?: string;
}

interface BroadcastConfirmation {
    tags: string[];
    message: string;
}

const suggestionChips = [
    "Summarize today's sales",
    "Who are my top customers this month?",
    "Show me pending payments"
];

const VyaparAIModal: React.FC = () => {
    const { isOpen, closeModal } = useAIModal();
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [broadcastConfirmation, setBroadcastConfirmation] = useState<BroadcastConfirmation | null>(null);
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Helper component to parse and render formatted markdown content
    const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
        return (
            <div className="text-sm text-inherit leading-relaxed space-y-1">
                {content.split('\n').map((line, index) => {
                    // Handle headings
                    if (line.startsWith('### ')) {
                        return <h4 key={index} className="font-semibold text-base mt-3 mb-1">{line.substring(4)}</h4>;
                    }

                    // Handle table-like lines
                    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
                        // Render with monospace font to help alignment
                        return <p key={index} className="font-mono text-xs whitespace-pre">{line}</p>;
                    }

                    let isListItem = false;
                    if (line.startsWith('* ')) {
                        isListItem = true;
                        line = line.substring(2);
                    }

                    const parts = line.split('**');
                    const renderedContent = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : <Fragment key={i}>{part}</Fragment>);

                    if (isListItem) {
                        return (
                            <div key={index} className="flex items-start">
                                <span className="mr-2 mt-1">•</span>
                                <p className="flex-1">{renderedContent}</p>
                            </div>
                        );
                    }

                    if (line.trim() === '') return <div key={index} className="h-2" />;

                    return <p key={index}>{renderedContent}</p>;
                })}
            </div>
        );
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { role: 'assistant', content: "Hello! I'm Vyapar AI. How can I help you with your business today?" }
            ]);
        }
        if (!isOpen) {
            // Reset confirmation state when modal is closed
            setBroadcastConfirmation(null);
        }
    }, [isOpen, messages.length]);

    const handleDownload = (fileName: string, data: string) => {
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleConfirmBroadcast = async () => {
        if (!broadcastConfirmation) return;
        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'assistant', content: `Okay, preparing a broadcast for customers with tags: ${broadcastConfirmation.tags.join(', ')}.` }]);

        try {
            const tagsRes = await fetch('/api/tags');
            if (!tagsRes.ok) throw new Error("Could not fetch customer tags.");
            const allTags: Tag[] = await tagsRes.json();

            // Case-insensitive matching for tags
            const tagIds = allTags
                .filter(tag => broadcastConfirmation.tags.some(tagName => tagName.toLowerCase() === tag.name.toLowerCase()))
                .map(tag => tag.id);

            if (tagIds.length === 0) {
                throw new Error("I couldn't find any tags matching the names provided.");
            }

            const broadcastRes = await fetch('/api/broadcasts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tagIds: tagIds,
                    message: broadcastConfirmation.message,
                    templateId: 'ai_generated' // Use a placeholder template ID
                })
            });

            if (!broadcastRes.ok) {
                const errData = await broadcastRes.json();
                throw new Error(errData.error || "Broadcast failed to send.");
            }

            const broadcastData = await broadcastRes.json();
            setMessages(prev => [...prev, { role: 'assistant', content: `Success! The broadcast is being sent to ${broadcastData.recipients.length} recipients.` }]);

        } catch (error: any) {
            setMessages(prev => [...prev, { role: 'assistant', content: `I'm sorry, something went wrong: ${error.message}` }]);
        } finally {
            setBroadcastConfirmation(null);
            setIsLoading(false);
        }
    };


    const handleSubmit = async (prompt?: string) => {
        const userMessage = prompt || input;
        if (!userMessage.trim()) return;

        setBroadcastConfirmation(null);
        const newMessages: AIMessage[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai/vyapar-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: newMessages })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Something went wrong.");
            }

            const data = await res.json();

            if (data.type === 'navigate') {
                router.push(data.page);
                closeModal();
                return; // Stop execution to prevent further state updates
            }

            if (data.type === 'confirm_broadcast') {
                setBroadcastConfirmation({ tags: data.tags, message: data.message });
                setIsLoading(false);
                return; // Stop to show confirmation UI
            }

            const assistantMessages: AIMessage[] = [];

            if (data.text) {
                assistantMessages.push({ role: 'assistant', content: data.text, type: 'text' });
            }
            if (data.type === 'export_ready') {
                assistantMessages.push({ role: 'assistant', content: `I've prepared the data you requested.`, type: 'export_ready', fileName: data.fileName, data: data.data });
            }

            setMessages([...newMessages, ...assistantMessages]);

        } catch (error: any) {
            console.error("Vyapar AI Error:", error);
            setMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        // FIX: Removed framer-motion props (`initial`, `animate`, `exit`, `transition`) due to TypeScript error. This may affect animations.
                        className="w-full max-w-2xl h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 flex flex-col"
                    >
                        <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center">
                                <Icon name="sparkles" className="text-blue-500" />
                                <h2 className="text-lg font-semibold ml-2">Vyapar AI</h2>
                            </div>
                            <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Icon name="x" size={20} />
                            </button>
                        </header>

                        <main className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                        {msg.role === 'user' ? (
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        ) : (
                                            <MarkdownRenderer content={msg.content} />
                                        )}
                                        {msg.type === 'export_ready' && msg.fileName && msg.data && (
                                            <button
                                                onClick={() => handleDownload(msg.fileName!, msg.data!)}
                                                className="mt-2 flex items-center text-sm bg-green-600 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-700"
                                            >
                                                <Download size={16} className="mr-2" /> Download as CSV
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && !broadcastConfirmation && (
                                <div className="flex justify-start">
                                    <div className="max-w-md p-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center">
                                        <Loader2 className="animate-spin text-blue-500" size={20} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </main>

                        <footer className="p-4 border-t dark:border-gray-700 flex-shrink-0">
                            {broadcastConfirmation ? (
                                <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-semibold">Confirm Broadcast</h4>
                                    <p className="text-sm mt-1">Send this message to customers with tags: <strong>{broadcastConfirmation.tags.join(', ')}</strong>?</p>
                                    <blockquote className="mt-2 p-2 border-l-4 text-sm italic bg-white dark:bg-gray-600">"{broadcastConfirmation.message}"</blockquote>
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button onClick={() => setBroadcastConfirmation(null)} disabled={isLoading} className="px-3 py-1.5 text-sm border rounded-md">Cancel</button>
                                        <button onClick={handleConfirmBroadcast} disabled={isLoading} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md flex items-center">
                                            {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                                            Confirm & Send
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {messages.length <= 1 && suggestionChips.map(chip => (
                                            <button
                                                key={chip}
                                                onClick={() => handleSubmit(chip)}
                                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Ask anything about your business..."
                                            className="w-full p-3 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                            rows={1}
                                            disabled={isLoading}
                                        />
                                        <button
                                            onClick={() => handleSubmit()}
                                            disabled={isLoading || !input.trim()}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VyaparAIModal;