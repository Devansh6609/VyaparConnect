// This file is for server-side use only.
// It emits events by sending a POST request to the correct Socket.IO server
// (standalone for dev, integrated for prod).
export async function emitSocketEvent(event: string, data: any) {
  try {
    // The emitter needs an absolute URL to post back to the server.
    // This will be http://localhost:3000 in dev and your Render URL in production.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/socket/emit`;
    const EMITTER_SECRET = process.env.SOCKET_EMITTER_SECRET;

    if (!EMITTER_SECRET) {
      console.error(
        "SOCKET_EMITTER_SECRET is not defined. Cannot emit socket event."
      );
      return;
    }

    // Fire-and-forget the request. We don't need to wait for the response.
    // Added a catch block to log any potential errors during the fetch.
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-emitter-secret": EMITTER_SECRET,
      },
      body: JSON.stringify({ event, data }),
    }).catch((error) => {
      console.error(
        `Failed to emit socket event '${event}' to ${url}:`,
        error.message
      );
    });
  } catch (error) {
    // This outer catch is for any synchronous errors, though unlikely here.
    console.error("Error preparing socket event emission:", error);
  }
}
