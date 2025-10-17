import { createServer } from "http";
import next from "next";
import express from "express";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3001;

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  // ✅ Initialize socket.io with custom path
  const io = new Server(httpServer, {
    path: "/api/socket",
    cors: { origin: "*" },
  });

  // Store instance globally so API routes/components can emit events if needed
  (globalThis as any).io = io;

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });
  });

  // Let Next.js handle everything else
  server.all("*", (req, res) => handle(req, res));

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
