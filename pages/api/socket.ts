// pages/api/socket.ts
// FIX: Changed to a type-only import for `NextApiRequest` and `NextApiResponse` to resolve module resolution errors.
import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.IO server");
    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    res.socket.server.io = io;
    // FIX: Replaced 'global' with 'globalThis' for broader environment compatibility.
    (globalThis as any).io = io as IOServer;

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      socket.on("join", (room) => {
        socket.join(room);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });
  } else {
    // already initialized
  }

  res.end();
}
