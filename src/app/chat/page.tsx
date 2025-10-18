"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import ChatModule from "@/components/ChatModule";
import RightPanel from "@/components/RightPanel";
// FIX: Used type-only import to prevent module resolution errors.
import type { Contact, Product, Message } from "../../types";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import ChatPageSkeleton from "@/components/skeletons/ChatPageSkeleton";

function ChatPageContent() {
    const searchParams = useSearchParams();

    // FIX: Use optional chaining and nullish coalescing to handle potentially null searchParams
    const contactIdFromUrl = searchParams?.get('contactId') ?? null;
    const messageFromUrl = searchParams?.get('message') ?? null;

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [activeContact, setActiveContact] = useState<Contact | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [initialMessage, setInitialMessage] = useState<string | null>(null);
    const [initialCursor, setInitialCursor] = useState<string | null>(null);

    const [rightPanelKey, setRightPanelKey] = useState(0);
    const [initialRightPanelView, setInitialRightPanelView] = useState("main_menu");

    // State for AI-driven order creation workflow
    const [awaitingAddressResponseForOrder, setAwaitingAddressResponseForOrder] = useState(false);
    const [newAddressForOrder, setNewAddressForOrder] = useState<string | null>(null);


    useEffect(() => {
        const newSocket = getSocket();
        setSocket(newSocket);
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch('/api/contacts');
            if (res.ok) {
                const data = await res.json();
                const contactArray = data.contacts;
                if (Array.isArray(contactArray)) {
                    setContacts(contactArray);
                    return contactArray;
                } else {
                    console.error("API response for contacts is not an array:", data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        }
        return [];
    };

    useEffect(() => {
        fetchContacts().then(fetchedContacts => {
            if (contactIdFromUrl) {
                const contactToSelect = fetchedContacts.find((c: Contact) => c.id === contactIdFromUrl);
                if (contactToSelect) {
                    setActiveContact(contactToSelect);
                    if (messageFromUrl) {
                        setInitialMessage(messageFromUrl);
                    }
                }
            }
        });
    }, [contactIdFromUrl, messageFromUrl]);


    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage: Message) => {
            if (newMessage.contactId === activeContact?.id) {
                setMessages((prev) =>
                    prev.some(m => m.id === newMessage.id) ? prev : [...prev, newMessage]
                );
            }

            if (awaitingAddressResponseForOrder && newMessage.from === 'customer' && newMessage.text) {
                const responseText = newMessage.text.trim().toLowerCase();
                // If the response is anything other than a simple confirmation, treat it as a new address.
                if (responseText !== 'yes' && responseText !== 'yep' && responseText !== 'ok' && responseText !== 'confirm') {
                    setNewAddressForOrder(newMessage.text);
                }
                // Stop listening for an address response.
                setAwaitingAddressResponseForOrder(false);
            }

            setContacts(prevContacts => {
                const currentContacts = Array.isArray(prevContacts) ? prevContacts : [];
                let contactExists = false;
                const updatedContacts = currentContacts.map(c => {
                    if (c.id === newMessage.contactId) {
                        contactExists = true;
                        return {
                            ...c,
                            lastMessage: newMessage.text || `Sent a ${newMessage.type}`,
                            lastMessageAt: newMessage.createdAt,
                            unreadCount: c.id === activeContact?.id ? 0 : (c.unreadCount || 0) + (newMessage.from === 'customer' ? 1 : 0),
                        }
                    }
                    return c;
                });

                if (!contactExists) {
                    fetchContacts();
                    return prevContacts;
                }

                return updatedContacts.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
            });
        };
        const handleStatusUpdate = (update: { wamid: string; status: Message["status"]; id?: string; }) => {
            setMessages((prev) => prev.map((msg) => msg.wamid === update.wamid || msg.id === update.id ? { ...msg, status: update.status, wamid: msg.wamid || update.wamid } : msg));
        };
        const handleDeleteMessage = ({ messageId }: { messageId: string }) => {
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        };
        const handleContactUpdate = (updatedContact: Contact) => {
            setContacts(prev => {
                const currentContacts = Array.isArray(prev) ? prev : [];
                return currentContacts.map(c => c.id === updatedContact.id ? { ...c, ...updatedContact } : c);
            });
            if (activeContact?.id === updatedContact.id) {
                setActiveContact(prev => prev ? { ...prev, ...updatedContact } : updatedContact);
            }
        };

        // FIX: Cast socket to 'any' to resolve type errors with event listeners.
        (socket as any).on("newMessage", handleNewMessage);
        (socket as any).on("message-status-update", handleStatusUpdate);
        (socket as any).on("deleteMessage", handleDeleteMessage);
        (socket as any).on("contact_updated", handleContactUpdate);

        return () => {
            // FIX: Cast socket to 'any' to resolve type errors with event listeners.
            (socket as any).off("newMessage", handleNewMessage);
            (socket as any).off("message-status-update", handleStatusUpdate);
            (socket as any).off("deleteMessage", handleDeleteMessage);
            (socket as any).off("contact_updated", handleContactUpdate);
        };
    }, [socket, activeContact, awaitingAddressResponseForOrder]);

    useEffect(() => {
        if (activeContact?.id) {
            const fetchMessages = async () => {
                setMessages([]);
                setInitialCursor(null);
                const res = await fetch(`/api/messages?contactId=${activeContact.id}`);
                if (res.ok) {
                    const { messages, nextCursor } = await res.json();
                    setMessages(messages);
                    setInitialCursor(nextCursor);
                }
            };
            fetchMessages();
            fetch(`/api/contacts/${activeContact.id}/reset-unread`, { method: "POST" });
            setContacts(prev => (Array.isArray(prev) ? prev : []).map(c => c.id === activeContact.id ? { ...c, unreadCount: 0 } : c))
        } else {
            setMessages([]);
            setInitialCursor(null);
        }
    }, [activeContact?.id]);

    const handleShareProduct = async (product: Product) => {
        if (!activeContact) return;
        setMessages(prev => [...prev, {
            id: `temp-${Date.now()}`, from: 'business', to: activeContact.phone, type: 'product',
            text: `Sharing ${product.name}...`, createdAt: new Date().toISOString(), contactId: activeContact.id, status: 'pending', product
        } as Message]); // Cast to Message to satisfy type checker
        await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactId: activeContact.id, type: "product", productId: product.id }),
        });
    };

    const handleSelectContact = (contact: Contact) => {
        if (activeContact?.id !== contact.id) {
            setActiveContact(contact);
            setInitialRightPanelView("main_menu");
            setRightPanelKey((prev) => prev + 1);
            setInitialMessage(null); // Clear any pre-filled message
        }
    };

    const handleCreateOrderTrigger = async () => {
        if (!activeContact) return;

        setNewAddressForOrder(null);
        setInitialRightPanelView("new_order");
        setRightPanelKey(prev => prev + 1);

        let messageText = '';
        if (activeContact.lastShippingAddress) {
            messageText = `Hi ${activeContact.name}, we're creating a new order for you. Should we use your last known address for delivery?\n\n${activeContact.lastShippingAddress}\n\nPlease reply with 'Yes' to confirm, or provide a new address.`;
        } else {
            messageText = `Hi ${activeContact.name}, we're creating a new order for you. What is the delivery address?`;
        }

        setAwaitingAddressResponseForOrder(true);

        await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactId: activeContact.id, text: messageText }),
        });
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="transition-all duration-300 ease-in-out flex-1">
                <ChatModule
                    socket={socket}
                    contacts={contacts}
                    setContacts={setContacts}
                    activeContact={activeContact}
                    onSelectContact={handleSelectContact}
                    onPromoteCustomer={() => {
                        setInitialRightPanelView("master_customer_details");
                        setRightPanelKey(prev => prev + 1);
                    }}
                    messages={messages}
                    setMessages={setMessages}
                    initialMessage={initialMessage}
                    initialCursor={initialCursor}
                    onCreateOrder={handleCreateOrderTrigger}
                />
            </div>
            {activeContact && (
                <RightPanel
                    key={rightPanelKey}
                    activeContact={activeContact}
                    messages={messages}
                    onShareProduct={handleShareProduct}
                    initialViewId={initialRightPanelView as any}
                    socket={socket}
                    newAddressForOrder={newAddressForOrder}
                />
            )}
        </div>
    );
}


export default function ChatPage() {
    return (
        <Suspense fallback={<ChatPageSkeleton />}>
            <ChatPageContent />
        </Suspense>
    );
}
