// This file is for server-side use only.
import { io } from "./socket";

// Backend emitter (for server-side API routes on Vercel)
export async function emitSocketEvent(event: string, data: any) {
  try {
    io.emit(event, data);
  } catch (error) {
    console.error("Failed to emit socket event:", error);
  }
}
