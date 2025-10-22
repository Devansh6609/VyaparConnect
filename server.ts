// server.ts
import { createServer, IncomingMessage, ServerResponse } from "http";
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

  // Middleware to make the io instance available to API routes
  expressApp.use((req: any, res, next) => {
    req.io = io;
    next();
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
