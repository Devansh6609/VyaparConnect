const { Server } = require("socket.io");

// Render automatically sets the PORT environment variable
const PORT = process.env.PORT || 4000;

// Create the Socket.IO server instance
const io = new Server({
  // Use the port provided by the host (Render)
  serveClient: false, // Optimizes by not serving the client library
  cors: {
    // Allows connections from any domain (Vercel deployment, local dev, etc.)
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

// Start listening on the assigned port
io.listen(PORT);

console.log(`🔌 Socket.IO Server listening on port ${PORT}`);

// --- Connection and Event Handlers ---

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // Event handler for joining a specific chat room (e.g., a contact's ID)
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// This is where you would access the instance from your Next.js API routes 
// if you were running on the same server. Since we are using an external service,
// the Vercel API routes will use a different method (HTTP Post or client library)
// to send events back to this server.

// Export the IO instance for external use if needed (e.g., in a local test script)
module.exports = { io };
