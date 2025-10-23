const fs = require('fs');
const path = require('path');

// Load .env.local first if it exists, which is common in Next.js projects.
// .env will be loaded afterwards, but variables from .env.local will take precedence as they are set first.
const localEnvPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(localEnvPath)) {
  require('dotenv').config({ path: localEnvPath });
}
require("dotenv").config();


const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN_ENV = process.env.CORS_ORIGIN || "*";
const EMITTER_SECRET = process.env.SOCKET_EMITTER_SECRET;

if (!EMITTER_SECRET) {
    console.error("FATAL: SOCKET_EMITTER_SECRET is not set. The server will not be able to receive events from the backend.");
    console.error("Please create a .env or .env.local file and add SOCKET_EMITTER_SECRET=<your_secret_key>");
    process.exit(1);
}

const app = express();
app.use(express.json());
const httpServer = createServer(app);

const ALLOWED_ORIGINS = ALLOWED_ORIGIN_ENV === "*" 
    ? "*" 
    : ALLOWED_ORIGIN_ENV.split(',').map(s => s.trim());

const io = new Server(httpServer, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ["GET", "POST"],
    },
});

// Health check endpoint
app.get("/", (req, res) => {
    res.send("Socket server is running.");
});

// Secure endpoint for Vercel functions to emit events
app.post("/emit", (req, res) => {
    const secret = req.headers["x-emitter-secret"];
    if (secret !== EMITTER_SECRET) {
        console.warn("Received /emit request with invalid secret.");
        return res.status(401).send("Unauthorized");
    }

    const { event, data } = req.body;
    if (!event || !data) {
        return res.status(400).send("Bad Request: Missing event or data.");
    }

    // Emit the event to all connected clients
    io.emit(event, data);
    
    res.status(200).send("Event emitted.");
});

io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Socket & Express server listening on port ${PORT}`);
    console.log(`CORS Origins allowed: ${JSON.stringify(ALLOWED_ORIGINS)}`);
});