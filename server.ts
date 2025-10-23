// server.ts
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import express from "express";
import { io } from "./src/lib/socket"; // Import the singleton instance

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = createServer(expressApp);

  // Attach Socket.IO to the HTTP server
  io.attach(httpServer, {
    cors: {
      origin: "*", // Adjust for production if needed
      methods: ["GET", "POST"],
    },
  });

  // Add connection logging for debugging
  io.on("connection", (socket) => {
    console.log("✅ Socket client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("❌ Socket client disconnected:", socket.id);
    });
  });

  // Add a dedicated endpoint for API routes to emit socket events.
  // The express.json() middleware is applied ONLY to this route.
  expressApp.post("/api/socket/emit", express.json(), (req, res) => {
    const secret = req.headers["x-emitter-secret"];
    const EMITTER_SECRET = process.env.SOCKET_EMITTER_SECRET;

    if (!EMITTER_SECRET || secret !== EMITTER_SECRET) {
      console.warn("Received /api/socket/emit request with invalid secret.");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { event, data } = req.body;
    if (event && data) {
      io.emit(event, data);
      res.status(200).json({ success: true, message: "Event emitted." });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Missing event or data." });
    }
  });

  // Handle all other requests with Next.js
  // FIX: Removed explicit `IncomingMessage` and `ServerResponse` types to resolve
  // an incompatibility with Express's `RequestHandler`. Type inference correctly
  // handles compatibility with the Next.js handler.
  expressApp.all("*", (req, res) => {
    const parsedUrl = parse(req.url!, true);
    // FIX: Cast `req` and `res` to `any` to resolve a type incompatibility
    // between the Express request handler and the Next.js handler. This can be
    // caused by conflicting global type definitions.
    return handle(req as any, res as any, parsedUrl);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
