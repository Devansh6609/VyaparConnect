// src/components/ChatView.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import type { Contact, Message, ProductImage } from "../types";
import ChatInput from "./ChatInput";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ImageGalleryModal from "./ImageGalleryModal";
import SummaryModal from "./SummaryModel";
import { MoreVertical, Phone, Download, Reply, PlusCircle, Clock, X, Check, CheckCheck, Star, Loader2, BookText } from "lucide-react";
import { format } from "date-fns";
import Icon from "@/components/ui/Icon";
import { motion, AnimatePresence } from "framer-motion";
import ProductMessage from "./ProductMessage";

interface ChatViewProps {
    chat: Contact | null;
    onPromoteCustomer: () => void;
    messages: Message[];
    onMessagesChange: React.Dispatch<React.SetStateAction<Message[]>>;
    initialMessage?: string | null;
    initialNextCursor?: string | null;
    onCreateOrder: () => void;
    onBack: () => void; // For mobile navigation
    onShowPanel: () => void; // For mobile navigation
}

const getReplyPreviewMediaUrl = (msg: Message | null): string | null => {
    if (!msg) return null;
    if (msg.type === 'image' && msg.mediaUrl) {
        return msg.mediaUrl;
    }
    if (msg.type === 'product' && msg.product?.images?.[0]?.url) {
        return msg.product.images[0].url;
    }
    return null;
};

const ChatView: React.FC<ChatViewProps> = ({ chat, onPromoteCustomer, messages = [], onMessagesChange, initialMessage, initialNextCursor, onCreateOrder, onBack, onShowPanel }) => {
    const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
    const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
    const [newMessage, setNewMessage] = useState<string>("");
    const [galleryState, setGalleryState] = useState<{ images: ProductImage[], startIndex: number } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const topMessageRef = useRef<HTMLDivElement>(null);
    const oldScrollHeightRef = useRef(0);

    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // New states for AI features
    const [smartReplies, setSmartReplies] = useState<string[]>([]);
    const [isFetchingReplies, setIsFetchingReplies] = useState(false);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);


    useEffect(() => {
        setNextCursor(initialNextCursor ?? null);
        setHasMore(!!initialNextCursor);
    }, [initialNextCursor]);

    const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [lastMessageId]);

    useEffect(() => {
        if (initialMessage && chat) {
            setNewMessage(initialMessage);
        }
    }, [initialMessage, chat?.id]);

    const fetchSmartReplies = useCallback(async () => {
        if (!messages || messages.length === 0) return;
        setIsFetchingReplies(true);
        try {
            const recentHistory = messages
                .slice(-3) // Get last 3 messages
                .map(msg => `${msg.from === 'business' ? 'Business' : 'Customer'}: ${msg.text || '[attachment]'}`)
                .join('\n');

            const res = await fetch('/api/ai/smart-replies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: recentHistory })
            });

            if (res.ok) {
                const data = await res.json();
                setSmartReplies(data.replies || []);
            }
        } catch (error) {
            console.error("Failed to fetch smart replies:", error);
            setSmartReplies([]);
        } finally {
            setIsFetchingReplies(false);
        }
    }, [messages]);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.from === 'customer') {
            fetchSmartReplies();
        } else {
            // Clear replies if the last message is from the business
            setSmartReplies([]);
        }
    }, [messages, fetchSmartReplies]);

    const handleSummarizeClick = async () => {
        if (!messages || messages.length === 0) return;
        setIsSummaryModalOpen(true);
        setIsSummarizing(true);
        setSummary('');
        try {
            const fullHistory = messages
                .map(msg => `${msg.from === 'business' ? 'Business' : 'Customer'}: ${msg.text || '[attachment]'}`)
                .join('\n');

            const res = await fetch('/api/ai/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: fullHistory })
            });
            if (res.ok) {
                const data = await res.json();
                setSummary(data.text);
            } else {
                throw new Error("Failed to generate summary.");
            }
        } catch (error) {
            console.error("Summarization error:", error);
            setSummary("Sorry, we couldn't generate a summary at this time.");
        } finally {
            setIsSummarizing(false);
        }
    };

    const loadMoreMessages = useCallback(async () => {
        if (!hasMore || isLoadingMore || !nextCursor || !chat) return;

        const container = messagesContainerRef.current;
        if (container) oldScrollHeightRef.current = container.scrollHeight;

        setIsLoadingMore(true);

        try {
            const res = await fetch(`/api/messages?contactId=${chat.id}&limit=30&cursor=${nextCursor}`);
            if (res.ok) {
                const { messages: newMessages, nextCursor: newCursor } = await res.json();
                onMessagesChange(prev => [...newMessages, ...(Array.isArray(prev) ? prev : [])]);
                setNextCursor(newCursor);
                setHasMore(!!newCursor);
            }
        } catch (error) {
            console.error("Failed to load more messages:", error);
        }
    }, [hasMore, isLoadingMore, nextCursor, chat, onMessagesChange]);

    useLayoutEffect(() => {
        const container = messagesContainerRef.current;
        if (container && isLoadingMore) {
            container.scrollTop = container.scrollHeight - oldScrollHeightRef.current;
            setIsLoadingMore(false);
        }
    }, [messages.length, isLoadingMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore && !isLoadingMore) {
                loadMoreMessages();
            }
        }, { threshold: 1.0 });

        const topEl = topMessageRef.current;
        if (topEl) {
            observer.observe(topEl);
        }
        return () => {
            if (topEl) observer.unobserve(topEl);
        };
    }, [hasMore, isLoadingMore, loadMoreMessages]);


    const handleScrollToMessage = (messageId: string | null | undefined) => {
        if (!messageId) return;
        const element = document.getElementById(`message-${messageId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-message');
            setTimeout(() => {
                element.classList.remove('highlight-message');
            }, 1500);
        }
    };


    const getReplyPreviewText = (msg: Message | null): string | null => {
        if (!msg) return null;
        if (msg.text) return msg.text;
        if (msg.fileName) return msg.fileName;
        if (msg.type === 'image') return '📷 Image';
        if (msg.type === 'document') return '📎 Document';
        if (msg.product?.name) return `📦 ${msg.product.name}`;
        return "an attachment";
    };

    const handleSendMessage = async (text: string, file?: File) => {
        if (!chat) return;
        if (!text.trim() && !file) return;

        const tempId = Date.now().toString();

        // Clear smart replies as soon as a message is sent
        setSmartReplies([]);

        const optimisticMessage: Message = {
            id: tempId,
            from: "business",
            to: chat.phone,
            text: file ? file.name : text,
            createdAt: new Date().toISOString(),
            type: file ? (file.type.startsWith("image/") ? "image" : "document") : "text",
            contactId: chat.id,
            status: "pending",
            mediaUrl: file ? URL.createObjectURL(file) : undefined,
            fileName: file ? file.name : undefined,
            replyToId: replyingToMessage?.id || null,
            replyToText: getReplyPreviewText(replyingToMessage),
            replyToMediaUrl: getReplyPreviewMediaUrl(replyingToMessage),
        };

        onMessagesChange((prev) => (Array.isArray(prev) ? [...prev, optimisticMessage] : [optimisticMessage]));
        setNewMessage("");
        setReplyingToMessage(null);

        try {
            let messageBody: any = {
                contactId: chat.id,
                text,
                replyingToId: replyingToMessage?.id || null,
            };

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const uploadRes = await fetch("/api/uploads/file", { method: "POST", body: formData });
                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) throw new Error("File upload failed");

                messageBody.mediaUrl = uploadData.url;
                messageBody.fileName = file.name;
                messageBody.type = file.type.startsWith("image/") ? "image" : "document";
            }

            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageBody),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            const finalMessage: Message = await res.json();

            onMessagesChange((prev) => {
                const currentMessages = Array.isArray(prev) ? prev : [];
                const alreadyExists = currentMessages.some(msg => msg.id === finalMessage.id);
                if (alreadyExists) {
                    return currentMessages.filter(msg => msg.id !== tempId);
                } else {
                    return currentMessages.map((msg) => (msg.id === tempId ? finalMessage : msg));
                }
            });

        } catch (error) {
            console.error("Failed to send message:", error);
            onMessagesChange((prev) => {
                const currentMessages = Array.isArray(prev) ? prev : [];
                return currentMessages.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" } : msg));
            });
        }
    };

    const confirmDeleteMessage = async (messageId: string) => {
        setMessageToDelete(null);
        const originalMessages = messages;
        onMessagesChange(prev => (Array.isArray(prev) ? prev : []).filter(m => m.id !== messageId));
        try {
            const res = await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
            if (!res.ok) {
                onMessagesChange(originalMessages);
            }
        } catch (error) {
            onMessagesChange(originalMessages);
        }
    };

    const renderMessageStatusIcon = (status?: Message['status']) => {
        switch (status) {
            case "pending": return <Clock size={16} className="text-gray-500 dark:text-gray-400 ml-1" />;
            case "sent": return <Check size={16} className="text-gray-500 dark:text-gray-400 ml-1" />;
            case "delivered": return <CheckCheck size={16} className="text-gray-500 dark:text-gray-400 ml-1" />;
            case "read": return <CheckCheck size={16} className="text-blue-500 ml-1" />;
            case "failed": return <X size={16} className="text-red-500 ml-1" />;
            default: return null;
        }
    };

    const handleOpenGallery = (images: ProductImage[], startIndex: number) => {
        setGalleryState({ images, startIndex });
    };

    const renderMessageContent = (message: Message) => {
        switch (message.type) {
            case "image":
                return (
                    <div>
                        {message.mediaUrl && <img
                            src={message.mediaUrl}
                            alt={message.text || "Sent media"}
                            className="rounded-md max-w-xs cursor-pointer"
                            onClick={() => handleOpenGallery([{ id: message.id, url: message.mediaUrl! }], 0)}
                        />}
                        {message.text && <p className="text-sm whitespace-pre-wrap mt-1">{message.text}</p>}
                    </div>
                );
            case "document":
                return (
                    <a
                        href={message.mediaUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-black/5 dark:bg-black/20 p-2 rounded-lg hover:bg-black/10 dark:hover:bg-black/30"
                    >
                        <Icon name="file" className="w-8 h-8 text-gray-600 dark:text-gray-300 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="truncate font-medium">{message.fileName || "Document"}</p>
                        </div>
                        <Download className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    </a>
                );
            case "product":
                if (!message.product) {
                    return <p className="px-3 py-2 text-sm italic">Product: {message.text || 'Details not available.'}</p>;
                }
                return <ProductMessage message={message} onImageClick={handleOpenGallery} />;
            default:
                return <p className="text-sm whitespace-pre-wrap">{message.text}</p>;
        }
    };

    const renderMessages = () => {
        const messageList = Array.isArray(messages) ? messages : [];

        let lastDate: string | null = null;

        return messageList.map((message, index) => {
            const messageDate = format(new Date(message.createdAt), "yyyy-MM-dd");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;

            const isBusiness = message.from === "business";
            const isProductMessage = message.type === "product" && !!message.product;

            return (
                // FIX: Removed framer-motion props (`initial`, `animate`, `exit`, `transition`) to resolve TypeScript errors. This may affect animations.
                // FIX: The 'layout' prop is not valid here and causes a TypeScript error. Removing it may affect animations.
                <motion.div key={message.id}>
                    {showDate && (
                        <div className="text-center my-4">
                            <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow text-gray-600 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
                                {format(new Date(message.createdAt), "MMMM d, yyyy")}
                            </span>
                        </div>
                    )}
                    <div
                        id={`message-${message.id}`}
                        className={`flex ${isBusiness ? "justify-end" : "justify-start"} mt-1`}
                    >
                        <div
                            className={`flex items-end gap-2 group ${isBusiness ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            <div
                                className={`chat-bubble ${isBusiness ? "outgoing" : "incoming"} 
                                 ${isProductMessage ? "p-0 overflow-hidden bg-transparent shadow-none" : ""}`}
                            >
                                {message.replyToId && (
                                    <div
                                        onClick={() => handleScrollToMessage(message.replyToId)}
                                        className="text-xs bg-black/5 dark:bg-black/20 p-1.5 rounded-t-md mb-1 border-l-2 border-blue-500 cursor-pointer overflow-hidden"
                                    >
                                        <div className="flex items-start gap-2">
                                            {message.replyToMediaUrl && (
                                                <img src={message.replyToMediaUrl} alt="reply preview" className="w-10 h-10 object-cover rounded-sm flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate">{message.replyToText}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {renderMessageContent(message)}
                                {!isProductMessage && (
                                    <div
                                        className={`flex justify-end items-center text-xs mt-1 text-gray-500 dark:text-gray-400`}
                                    >
                                        <span>{format(new Date(message.createdAt), "p")}</span>
                                        {isBusiness && renderMessageStatusIcon(message.status)}
                                    </div>
                                )}
                            </div>
                            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                <button
                                    onClick={() => setReplyingToMessage(message)}
                                    className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full"
                                    title="Reply"
                                >
                                    <Reply size={16} />
                                </button>
                                {isBusiness && (
                                    <button
                                        onClick={() => setMessageToDelete(message)}
                                        className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full"
                                        title="Delete Message"
                                    >
                                        <Icon name="trash2" size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
        });
    };

    if (!chat) {
        return (
            <div className="w-full chat-background flex flex-col items-center justify-center text-center h-full">
                <Icon name="messageCircle" size={48} className="mx-auto text-gray-400 dark:text-gray-500" />
                <h2 className="text-2xl font-medium mt-4 text-gray-700 dark:text-gray-200">Welcome to VyaparConnect</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Select a chat to start messaging.</p>
            </div>
        );
    }

    return (
        <div
            className="w-full flex flex-col h-full"
        >
            <header className="bg-white dark:bg-[var(--header-background)] p-4 border-b border-gray-200 dark:border-[var(--card-border)] shadow-sm flex items-center justify-between z-10">
                <div className="flex items-center min-w-0">
                    <button onClick={onBack} className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden" aria-label="Back to chat list">
                        <Icon name="arrowLeft" size={20} />
                    </button>
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-bold text-gray-600 dark:text-gray-300">
                            {(chat.name || "?").charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                            <h2 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{chat.name}</h2>
                            <button
                                onClick={onPromoteCustomer}
                                title={
                                    chat.isMasterCustomer
                                        ? "Master Customer"
                                        : "Promote to Master Customer"
                                }
                            >
                                {chat.isMasterCustomer ? (
                                    <Star className="text-yellow-500 fill-yellow-400" size={18} />
                                ) : (
                                    <PlusCircle
                                        className="text-gray-400 hover:text-blue-500"
                                        size={18}
                                    />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.phone}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2">
                    <button onClick={handleSummarizeClick} className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" title="Summarize Conversation">
                        <BookText size={20} />
                    </button>
                    <button onClick={onShowPanel} className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full md:hidden" title="Contact Info">
                        <Icon name="info" size={20} />
                    </button>
                    <button className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full hidden md:block" title="Call Contact">
                        <Phone size={20} />
                    </button>
                    <button className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full hidden md:block" title="More Options">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>
            <main className="flex-1 relative chat-background">
                <div ref={messagesContainerRef} className="absolute inset-0 overflow-y-auto p-4">
                    <div ref={topMessageRef} className="h-1" />
                    {isLoadingMore && <div className="text-center py-2"><Loader2 className="animate-spin text-gray-500" /></div>}
                    <AnimatePresence>
                        {renderMessages()}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <ChatInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={handleSendMessage}
                messages={messages}
                smartReplies={smartReplies}
                isFetchingReplies={isFetchingReplies}
                replyingTo={
                    replyingToMessage
                        ? {
                            text: getReplyPreviewText(replyingToMessage),
                            from: replyingToMessage.from,
                        }
                        : null
                }
                onCancelReply={() => setReplyingToMessage(null)}
                onCreateOrder={onCreateOrder}
            />
            {messageToDelete && (
                <DeleteConfirmationModal
                    message={messageToDelete}
                    onClose={() => setMessageToDelete(null)}
                    onConfirmDelete={confirmDeleteMessage}
                />
            )}
            {galleryState && (
                <ImageGalleryModal
                    images={galleryState.images}
                    startIndex={galleryState.startIndex}
                    onClose={() => setGalleryState(null)}
                />
            )}
            <SummaryModal
                isOpen={isSummaryModalOpen}
                onClose={() => setIsSummaryModalOpen(false)}
                summary={summary}
                isLoading={isSummarizing}
            />
        </div>
    );
};

export default ChatView;