
"use client";

import React from "react";
// FIX: Corrected import path for ChatList.tsx to resolve module resolution error.
import ChatList from "./ChatList";
import ChatView from "./ChatView";
// FIX: Used type-only import to prevent module resolution errors.
import type { Contact, Message } from "../types";
import { Socket } from "socket.io-client";

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
}) => {
    return (
        <div className="flex h-full bg-white overflow-hidden">
            <ChatList
                socket={socket}
                activeContactId={activeContact?.id || null}
                onSelectChat={onSelectContact}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <ChatView
                    chat={activeContact}
                    onPromoteCustomer={onPromoteCustomer}
                    messages={messages}
                    onMessagesChange={setMessages}
                    initialMessage={initialMessage}
                    initialNextCursor={initialCursor}
                    onCreateOrder={onCreateOrder}
                />
            </div>
        </div>
    );
};

export default ChatModule;