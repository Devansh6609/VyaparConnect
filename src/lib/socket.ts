// src/lib/socket.ts
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

    // FIX: Cast socket to 'any' to resolve TypeScript error about 'on' property not existing. This pattern is used elsewhere in the codebase for the same issue.
    (socket as any).on("connect", () => {
      console.log("✅ Socket connected to external server:", socket!.id);
    });

    // FIX: Cast socket to 'any' to resolve TypeScript error about 'on' property not existing. This pattern is used elsewhere in the codebase for the same issue.
    (socket as any).on("disconnect", (reason: Socket.DisconnectReason) => {
      console.log("❌ Socket disconnected from external server:", reason);
    });
  }

  if (socket.disconnected) {
    socket.connect();
  }

  return socket;
};

// Backend emitter (for server-side API routes on Vercel)
export async function emitSocketEvent(event: string, data: any) {
  const socketUrl = process.env.SOCKET_SERVER_URL;
  const secret = process.env.SOCKET_EMITTER_SECRET;

  if (!socketUrl || !secret) {
    console.error(
      "Socket emitter URL or secret is not configured on the server. Real-time events will not be sent."
    );
    return;
  }

  try {
    // Fire-and-forget the fetch request. We don't need to wait for the response.
    fetch(`${socketUrl}/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-emitter-secret": secret,
      },
      body: JSON.stringify({ event, data }),
    });
  } catch (error) {
    console.error("Failed to emit socket event:", error);
  }
}
