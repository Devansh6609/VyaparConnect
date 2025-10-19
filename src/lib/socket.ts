import { io, Socket } from "socket.io-client";
import type { Server as IOServer } from "socket.io";

let socket: Socket | null = null;

// Ensure this variable is set in Vercel to your Render URL (e.g., https://vyapar-socket-server-xxx.render.com)
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

// Frontend socket (client)
export const getSocket = (): Socket => {
  if (!socket) {
    if (!SOCKET_SERVER_URL) {
      console.error(
        "❌ SOCKET_SERVER_URL is not configured! Defaulting to localhost."
      );
    }

    // FINAL FIX: We explicitly use the full external URL and ensure no path is set,
    // relying on the default Socket.IO path of /socket.io/ on the Render server.
    socket = io(SOCKET_SERVER_URL || "http://localhost:3000", {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      // REMOVED: path: "/api/socket" - This was incorrectly directing traffic.
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected to Render server:", socket!.id);
    });

    socket.on("disconnect", (reason: Socket.DisconnectReason) => {
      console.log("❌ Socket disconnected from Render server:", reason);
    });
  }

  if (socket && socket.disconnected) {
    socket.connect();
  }

  return socket;
};

// Backend socket (server) - This remains unused on Vercel.
export function getIO(): IOServer | undefined {
  return (globalThis as any).io as IOServer | undefined;
}

// Backend socket (server)
// export function getIO(): IOServer | undefined {
//   return (globalThis as any).io as IOServer | undefined;
// }
// // src/lib/socket.ts
// import { io, Socket } from "socket.io-client";
// import type { Server as IOServer } from "socket.io";

// let socket: Socket | null = null;

// // Frontend socket (client)
// export const getSocket = (): Socket => {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
//       path: "/api/socket", // must match server.ts
//       // FIX: Removed 'transports' property to resolve type error.
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 2000,
//     });

//     // FIX: Cast socket to 'any' to resolve type errors with the 'on' method.
//     (socket as any).on("connect", () => {
//       console.log("✅ Socket connected:", socket!.id);
//     });

//     // FIX: Cast socket to 'any' to resolve type errors with the 'on' method.
//     (socket as any).on("disconnect", (reason: any) => {
//       console.log("❌ Socket disconnected:", reason);
//     });
//   }

//   // If socket exists but is disconnected, try to reconnect.
//   if (socket.disconnected) {
//     socket.connect();
//   }

//   return socket;
// };

// // Backend socket (server)
// export function getIO(): IOServer | undefined {
//   return (globalThis as any).io as IOServer | undefined;
// }
