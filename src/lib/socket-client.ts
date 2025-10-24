"use client";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { Contact, Message, Quotation, Order } from "@/types";

// Define the events the server will send to the client
export interface ServerToClientEvents {
  newMessage: (message: Message) => void;
  message_status_update: (update: {
    wamid: string;
    status: Message["status"];
    id?: string;
  }) => void;
  "message-status-update": (update: {
    wamid: string;
    status: Message["status"];
    id?: string;
  }) => void;
  deleteMessage: (data: { messageId: string }) => void;
  contact_updated: (contact: Contact) => void;
  new_lead: (contact: Contact) => void;
  quotation_update: (quotation: Quotation) => void;
  order_update: (order: Order) => void;
  contact_read: (data: { contactId: string }) => void;
}

// Define the events the client can send to the server (currently none, but good practice to define)
interface ClientToServerEvents {}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

// Frontend socket (client)
export const getSocket = (): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> => {
  if (!socket) {
    // When no URL is provided, it defaults to the current host.
    // This works for both local dev (localhost:3000) and production on Render.
    socket = io({
      path: "/socket.io", // Must match the path on the server
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket!.id);
    });

    socket.on("disconnect", (reason: Socket.DisconnectReason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Socket connection error:", err.message, err);
    });
  }

  if (socket.disconnected) {
    socket.connect();
  }

  return socket;
};
