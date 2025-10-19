const { Server } = require("socket.io");

// Render automatically sets the PORT environment variable
const PORT = process.env.PORT || 4000;

// Determine the allowed origin for CORS
// We prioritize the Vercel environment variable for production safety, 
// otherwise default to a broad wildcard for development/local testing flexibility.
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_VERCEL_URL 
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` // Use Vercel's domain for strict production CORS
  : "*"; // Fallback for local testing or if environment var isn't set

// Create the Socket.IO server instance
const io = new Server({
  serveClient: false, 
  cors: {
    // FINAL FIX: We explicitly set the origin based on environment to ensure security 
    // without running into platform-specific blocking issues.
    origin: ALLOWED_ORIGIN, 
    methods: ["GET", "POST"],
  },
});

// Start listening on the assigned port
io.listen(PORT);

console.log(`🔌 Socket.IO Server listening on port ${PORT}`);
console.log(`CORS Origin allowed: ${ALLOWED_ORIGIN}`);

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

// Export the IO instance for external access (like the Vercel API routes need)
module.exports = { io };
