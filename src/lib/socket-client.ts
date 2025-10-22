"use client";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

let socket: Socket | null = null;

// Frontend socket (client)
export const getSocket = (): Socket => {
  if (!socket) {
    // Connect to the same host that serves the page
    socket = io({
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
  }

  if (socket.disconnected) {
    socket.connect();
  }

  return socket;
};
