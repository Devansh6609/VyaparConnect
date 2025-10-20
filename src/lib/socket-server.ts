// This file is for server-side use only.

// Backend emitter (for server-side API routes on Vercel)
export async function emitSocketEvent(event: string, data: any) {
  const socketUrl = process.env.SOCKET_SERVER_URL;
  const secret = process.env.SOCKET_EMITTER_SECRET;

  if (!socketUrl || !secret) {
    console.error(
      "Socket emitter URL or secret is not configured on the server. Real-time events will not be sent."
    );
    return;
  }

  try {
    // Fire-and-forget the fetch request.
    fetch(`${socketUrl}/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-emitter-secret": secret,
      },
      body: JSON.stringify({ event, data }),
    });
  } catch (error) {
    console.error("Failed to emit socket event:", error);
  }
}
