"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Frontend socket (client)
export const getSocket = (): Socket => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
    if (!socketUrl) {
      console.error(
        "Socket server URL is not configured. Please set NEXT_PUBLIC_SOCKET_SERVER_URL."
      );
      // Return a dummy socket object to prevent crashing the app, though it won't connect.
      return io({ autoConnect: false });
    }

    socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected to external server:", socket!.id);
    });

    socket.on("disconnect", (reason: Socket.DisconnectReason) => {
      console.log("❌ Socket disconnected from external server:", reason);
    });
  }

  if (socket.disconnected) {
    socket.connect();
  }

  return socket;
};
