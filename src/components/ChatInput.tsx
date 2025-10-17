// src/components/ChatInput.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Send, X, File, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import { AnimatePresence, motion } from 'framer-motion';
import type { Message } from '../types';

interface ReplyingToMessage {
    text?: string | null;
    from: string;
}

interface ChatInputProps {
    newMessage: string;
    setNewMessage: (value: string) => void;
    sendMessage: (text: string, file?: File) => void;
    replyingTo?: ReplyingToMessage | null;
    onCancelReply?: () => void;
    messages: Message[];
    smartReplies: string[];
    isFetchingReplies: boolean;
    onCreateOrder: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    newMessage,
    setNewMessage,
    sendMessage,
    replyingTo,
    onCancelReply,
    messages,
    smartReplies,
    isFetchingReplies,
    onCreateOrder,
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [fileToSend, setFileToSend] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
    const [aiCommand, setAiCommand] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Temporarily shrink to get the correct scrollHeight for the content
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            // Set the new height. Capped by max-h-32 in Tailwind CSS.
            textarea.style.height = `${scrollHeight}px`;
        }
    }, [newMessage]);

    const handleSendMessage = (textToSend?: string) => {
        const messageText = typeof textToSend === 'string' ? textToSend : newMessage;
        sendMessage(messageText, fileToSend || undefined);
        setNewMessage('');
        setFileToSend(null);
        setFilePreview(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileToSend(file);
            if (file.type.startsWith('image/')) {
                setFilePreview(URL.createObjectURL(file));
            } else {
                setFilePreview('document'); // Special value for non-image files
            }
        }
        setShowAttachmentMenu(false);
    };

    const removeAttachment = () => {
        setFileToSend(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAiCommand = async () => {
        if (!aiCommand.trim() || !messages) return;

        setIsAiLoading(true);
        setAiError('');

        try {
            const conversationHistory = messages
                .map(msg => `${msg.from === 'business' ? 'Business' : 'Customer'}: ${msg.text || '[attachment]'}`)
                .join('\n');

            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    command: aiCommand,
                    history: conversationHistory,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "VyaparAI is currently unavailable. Please try again.");
            }

            if (data.functionCall && data.functionCall.name === 'createOrder') {
                onCreateOrder();
                setIsAiPromptOpen(false);
                setAiCommand('');
            } else {
                setNewMessage(data.text);
                setIsAiPromptOpen(false);
                setAiCommand('');
            }
        } catch (error: any) {
            console.error("VyaparAI error:", error);
            setAiError(error.message || "VyaparAI is currently unavailable. Please try again.");
            setTimeout(() => setAiError(''), 3000);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleAiKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAiCommand();
        }
    };


    return (
        <div className="bg-gray-100 dark:bg-[var(--header-background)] p-4 border-t border-gray-200 dark:border-[var(--card-border)] relative">
            <AnimatePresence>
                {(isFetchingReplies || smartReplies.length > 0) && (
                    <motion.div
                        className="mb-2 flex flex-wrap items-center gap-2"
                    >
                        {isFetchingReplies && <Loader2 size={18} className="animate-spin text-gray-400" />}
                        {smartReplies.map((reply, i) => (
                            <motion.button
                                key={i}
                                onClick={() => handleSendMessage(reply)}
                                className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 whitespace-nowrap"
                            >
                                {reply}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAiPromptOpen && (
                    <motion.div
                        className="mb-2"
                    >
                        <div className="relative">
                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                            <input
                                type="text"
                                value={aiCommand}
                                onChange={(e) => setAiCommand(e.target.value)}
                                onKeyDown={handleAiKeyPress}
                                placeholder="Ask VyaparAI to draft a reply, create an order, etc..."
                                className="w-full bg-white dark:bg-gray-700 border-2 border-blue-400 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                disabled={isAiLoading}
                            />
                            {isAiLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-500" size={20} />}
                        </div>
                        {aiError && <p className="text-xs text-red-500 text-center mt-1">{aiError}</p>}
                    </motion.div>
                )}
            </AnimatePresence>

            {replyingTo && (
                <div className="bg-white dark:bg-gray-700 p-2 rounded-t-lg text-sm relative border-l-2 border-blue-500 mb-2 shadow-sm">
                    <button onClick={onCancelReply} className="absolute top-1 right-1 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                        <X size={16} />
                    </button>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">Replying to {replyingTo.from === 'business' ? 'yourself' : 'the customer'}</p>
                    <p className="text-gray-600 dark:text-gray-300 truncate">{replyingTo.text || 'an attachment'}</p>
                </div>
            )}
            {filePreview && (
                <div className="bg-white dark:bg-gray-700 p-2 rounded-t-lg relative mb-2 shadow-sm flex items-center space-x-3">
                    <button onClick={removeAttachment} className="absolute top-1 right-1 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                        <X size={16} />
                    </button>
                    {filePreview === 'document' ? (
                        <div className="flex items-center space-x-2 text-sm">
                            <File className="w-8 h-8 text-blue-500" />
                            <span className="font-medium text-gray-700 dark:text-gray-200">{fileToSend?.name}</span>
                        </div>
                    ) : (
                        <img src={filePreview} alt="preview" className="w-16 h-16 object-cover rounded-md" />
                    )}
                </div>
            )}
            <div className="flex items-center space-x-3 bg-white dark:bg-[var(--input-background)] px-4 py-3 rounded-3xl shadow-sm">
                <button onClick={() => setIsAiPromptOpen(!isAiPromptOpen)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors" title="Ask VyaparAI">
                    <Sparkles className="w-5 h-5" />
                </button>
                <div className="relative">
                    {showEmojiPicker && (
                        <EmojiPicker
                            onSelectEmoji={(emoji) => setNewMessage(newMessage + emoji)}
                            onClose={() => setShowEmojiPicker(false)}
                        />
                    )}
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors">
                        <Smile className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative">
                    {showAttachmentMenu && (
                        <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ImageIcon className="w-4 h-4 mr-2 text-purple-500" /> Image
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <File className="w-4 h-4 mr-2 text-blue-500" /> Document
                            </button>
                        </div>
                    )}
                    <button onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/jpeg,image/png,application/pdf,.doc,.docx"
                />

                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none max-h-32 overflow-y-auto"
                    disabled={!!fileToSend}
                />
                <button
                    onClick={() => handleSendMessage()}
                    disabled={!newMessage?.trim() && !fileToSend}
                    className="p-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 rounded-full transition-colors flex-shrink-0"
                >
                    <Send className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;