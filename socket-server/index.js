const { Server } = require("socket.io");

// Render automatically sets the PORT environment variable
const PORT = process.env.PORT || 4000;

// Determine the allowed origin(s) for CORS.
// We use a dedicated variable, CORS_ORIGIN, which can be a comma-separated list of URLs,
// or '*' for full flexibility (local development).
const ALLOWED_ORIGIN_ENV = process.env.CORS_ORIGIN || "*"; 

// Convert comma-separated string into an array of origins, unless it's the wildcard '*'
const ALLOWED_ORIGINS = ALLOWED_ORIGIN_ENV === "*" 
    ? "*" 
    : ALLOWED_ORIGIN_ENV.split(',').map(s => s.trim());

// Create the Socket.IO server instance
const io = new Server({
  serveClient: false, 
  cors: {
    // FIX: Set the origin to the calculated array or wildcard
    origin: ALLOWED_ORIGINS, 
    methods: ["GET", "POST"],
  },
});

// Start listening on the assigned port
io.listen(PORT);

console.log(`🔌 Socket.IO Server listening on port ${PORT}`);
console.log(`CORS Origins allowed: ${JSON.stringify(ALLOWED_ORIGINS)}`);

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
