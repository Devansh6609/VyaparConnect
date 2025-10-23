

"use client";

import React from "react";
// FIX: Corrected import path for ChatList.tsx to resolve module resolution error.
import ChatList from "./ChatList";
import ChatView from "./ChatView";
// FIX: Used type-only import to prevent module resolution errors.
import type { Contact, Message } from "../types";
import type { Socket } from "socket.io-client";

interface ChatModuleProps {
    socket: Socket | null;
    activeContact: Contact | null;
    onSelectContact: (contact: Contact) => void;
    onPromoteCustomer: () => void;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    contacts: Contact[];
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
    initialMessage?: string | null;
    initialCursor?: string | null;
    onCreateOrder: () => void;
    onShowPanel: () => void; // For mobile
}

const ChatModule: React.FC<ChatModuleProps> = ({
    socket,
    contacts,
    setContacts,
    activeContact,
    onSelectContact,
    onPromoteCustomer,
    messages,
    setMessages,
    initialMessage,
    initialCursor,
    onCreateOrder,
    onShowPanel,
}) => {
    return (
        <div className="flex h-full bg-white overflow-hidden">
            <div className={`${activeContact ? 'hidden' : 'flex'} w-full md:flex md:w-auto flex-col`}>
                <ChatList
                    socket={socket}
                    activeContactId={activeContact?.id || null}
                    onSelectChat={onSelectContact}
                />
            </div>
            <div className={`${activeContact ? 'flex' : 'hidden'} flex-1 md:flex flex-col min-w-0`}>
                <ChatView
                    chat={activeContact}
                    onPromoteCustomer={onPromoteCustomer}
                    messages={messages}
                    onMessagesChange={setMessages}
                    initialMessage={initialMessage}
                    initialNextCursor={initialCursor}
                    onCreateOrder={onCreateOrder}
                    onBack={() => onSelectContact(null!)}
                    onShowPanel={onShowPanel}
                />
            </div>
        </div>
    );
};

export default ChatModule;