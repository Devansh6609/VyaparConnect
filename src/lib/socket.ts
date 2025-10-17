// src/lib/socket.ts
import { io, Socket } from "socket.io-client";
import type { Server as IOServer } from "socket.io";

let socket: Socket | null = null;

// Frontend socket (client)
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
      path: "/api/socket", // must match server.ts
      // FIX: Removed 'transports' property to resolve type error.
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    // FIX: Cast socket to 'any' to resolve type errors with the 'on' method.
    (socket as any).on("connect", () => {
      console.log("✅ Socket connected:", socket!.id);
    });

    // FIX: Cast socket to 'any' to resolve type errors with the 'on' method.
    (socket as any).on("disconnect", (reason: any) => {
      console.log("❌ Socket disconnected:", reason);
    });
  }

  // If socket exists but is disconnected, try to reconnect.
  if (socket.disconnected) {
    socket.connect();
  }

  return socket;
};

// Backend socket (server)
export function getIO(): IOServer | undefined {
  return (globalThis as any).io as IOServer | undefined;
}
