"use client";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

let socket: Socket | null = null;

// Frontend socket (client)
export const getSocket = (): Socket => {
  if (!socket) {
    // When no URL is provided, it defaults to the current host.
    // This works for both local dev (localhost:3000) and production on Render.
    socket = io({
      path: "/socket.io", // Must match the path on the server
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    // FIX: Cast socket to 'any' to resolve TypeScript error for 'on' method.
    (socket as any).on("connect", () => {
      console.log("✅ Socket connected:", socket!.id);
    });

    // FIX: Cast socket to 'any' to resolve TypeScript error for 'on' method.
    (socket as any).on("disconnect", (reason: Socket.DisconnectReason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    // FIX: Cast socket to 'any' to resolve TypeScript error for 'on' method.
    (socket as any).on("connect_error", (err: Error) => {
      console.error("Socket connection error:", err.message, err);
    });
  }

  if (socket.disconnected) {
    socket.connect();
  }

  return socket;
};
