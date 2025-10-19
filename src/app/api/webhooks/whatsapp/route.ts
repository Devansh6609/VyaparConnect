// src/app/api/webhooks/whatsapp/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
// IMPORTANT: Import io client to send events to the external Render server
import { io } from "socket.io-client";

// --- Socket Communication Helper ---
// Replaces the old, broken getIO()?.emit(...) on Vercel
// Improved reliability for short-lived connections in serverless environment
async function emitEventToRender(event: string, data: any) {
  const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
  if (!SOCKET_SERVER_URL) {
    console.warn("SOCKET_SERVER_URL is not set. Cannot emit real-time event.");
    return;
  }

  // Use the Socket.IO client library to connect to the external Render service
  try {
    const socket = io(SOCKET_SERVER_URL, {
      // Keep this short-lived and non-reconnecting for API events
      reconnection: false,
      timeout: 5000, // Timeout after 5 seconds
    });

    // Listener to ensure the event is sent and the socket is closed
    const onConnect = () => {
      console.log(`[Socket Client] Connected. Emitting ${event}.`);
      socket.emit(event, data);
      // Wait a small moment for the emission to fully process before closing
      setTimeout(() => {
        socket.close();
      }, 100);
    };

    // Listener for connection errors
    const onConnectError = (err: Error) => {
      console.error(
        `[Socket Client] Connection error to Render: ${err.message}`
      );
      socket.close();
    };

    // Listener for generic socket errors
    const onError = (err: Error) => {
      console.error(`[Socket Client] General socket error: ${err.message}`);
      socket.close();
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("error", onError);

    // Fallback timer to clean up resources if connection listeners fail to fire
    setTimeout(() => {
      if (!socket.connected) {
        console.warn(
          "[Socket Client] Timed out before connection or error, forcing close."
        );
        socket.close();
      }
    }, 5500);
  } catch (error) {
    console.error("Error creating socket client for event emission:", error);
  }
}

// Helper to get a temporary media URL from a WhatsApp media ID
async function getWhatsAppMediaUrl(
  mediaId: string,
  token: string
): Promise<string | null> {
  const url = `https://graph.facebook.com/v20.0/${mediaId}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      console.error(
        `Failed to fetch media URL for ID ${mediaId}:`,
        await response.json()
      );
      return null;
    }
    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error(`Error fetching media URL for ID ${mediaId}:`, error);
    return null;
  }
}

// Helper to download media from WhatsApp and re-upload to ImgBB for a permanent URL
async function downloadAndUploadMedia(
  mediaUrl: string,
  token: string,
  imgbbApiKey: string,
  fileName: string = "image.jpg"
): Promise<string | null> {
  if (!imgbbApiKey) {
    console.error("User-specific ImgBB API key is missing.");
    return null;
  }
  try {
    const downloadResponse = await fetch(mediaUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!downloadResponse.ok) {
      console.error("Failed to download media from WhatsApp.");
      return null;
    }
    const fileBuffer = await downloadResponse.arrayBuffer();
    const file = new Blob([fileBuffer]);

    const formData = new FormData();
    // Vercel environment may need a specific file type for FormData append
    // Using 'file' as blob name is generally safer than 'file' as third arg (filename)
    formData.append("image", file, fileName);

    const uploadResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const uploadData = await uploadResponse.json();

    if (uploadResponse.ok && uploadData.data?.url) {
      return uploadData.data.url;
    }
    console.error(
      "ImgBB upload failed:",
      uploadData.error?.message || "Unknown error"
    );
    return null;
  } catch (error) {
    console.error("Error in downloadAndUploadMedia:", error);
    return null;
  }
}

// Handle webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token) {
    // Find a user with this verify token
    const settings = await prisma.settings.findFirst({
      where: { whatsappVerifyToken: token },
    });

    if (settings) {
      console.log(`✅ WhatsApp Webhook Verified for user ${settings.userId}`);
      return new NextResponse(challenge ?? "", { status: 200 });
    }
  }

  console.error(
    "❌ WhatsApp Webhook Verification Failed. Mode or token incorrect."
  );
  return new NextResponse("Forbidden", { status: 403 });
}

// Handle incoming messages and status updates
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.object || !body.entry?.[0]?.changes?.[0]?.value) {
      return NextResponse.json({ status: "not a whatsapp webhook" });
    }

    const value = body.entry[0].changes[0].value;
    const phoneNumberId = value.metadata?.phone_number_id;

    if (!phoneNumberId) {
      console.warn("Webhook received without phone_number_id. Cannot process.");
      return NextResponse.json({
        success: true,
        message: "ignored (no phone id)",
      });
    }

    const settings = await prisma.settings.findFirst({
      where: { whatsappPhoneNumberId: phoneNumberId },
    });

    if (!settings || !settings.userId) {
      console.error(
        `No user configured for WhatsApp Phone Number ID: ${phoneNumberId}`
      );
      return NextResponse.json({
        success: true,
        message: "ignored (unregistered phone id)",
      });
    } // const io = getIO(); // OLD BROKEN LOGIC REMOVED // --- Message Status Update Logic ---

    if (value.statuses) {
      const statusUpdate = value.statuses[0];
      const wamid = statusUpdate.id;
      const newStatus = statusUpdate.status;

      let appStatus: "sent" | "delivered" | "read" | undefined;
      if (newStatus === "delivered") appStatus = "delivered";
      if (newStatus === "read") appStatus = "read";

      if (appStatus) {
        const updatedMessage = await prisma.message.updateMany({
          where: { wamid: wamid },
          data: { status: appStatus },
        });

        if (updatedMessage.count > 0) {
          // NEW LOGIC: Emit status update to the external Render server
          // Note: We do not await this, as the webhook must return quickly.
          emitEventToRender("message-status-update", {
            wamid,
            status: appStatus,
          });
          console.log(`✅ Message ${wamid} status updated to ${appStatus}`);
        }
      }
      return NextResponse.json({ success: true });
    } // --- New Incoming Message Logic ---

    if (!value.messages || !settings.whatsappAccessToken) {
      return NextResponse.json({ status: "not a message or token missing" });
    }

    const msg = value.messages[0];
    const from = msg.from;
    const isGroupMessage = from.endsWith("@g.us");

    let messageData: any = {
      from: "customer",
      to: phoneNumberId,
      type: msg.type,
      text: null,
      mediaUrl: null,
      fileName: null,
      wamid: msg.id,
      status: "received",
    };

    if (!isGroupMessage) {
      const contactName = value.contacts?.[0]?.profile?.name || from;
      let contact = await prisma.contact.findUnique({ where: { phone: from } });
      if (!contact) {
        contact = await prisma.contact.create({
          data: {
            phone: from,
            name: contactName,
            userId: settings.userId,
            stage: "NEW_LEAD",
          },
        }); // NEW LOGIC: Emit new lead event to the external Render server
        emitEventToRender("new_lead", contact);
      }
      messageData.contactId = contact.id;
      await prisma.contact.update({
        where: { id: contact.id },
        data: { unreadCount: { increment: 1 }, updatedAt: new Date() },
      });
    }

    if (msg.context && msg.context.id) {
      const originalMessage = await prisma.message.findFirst({
        where: { wamid: msg.context.id },
        include: { product: { include: { images: true } } },
      });
      if (originalMessage) {
        messageData.replyToId = originalMessage.id;
        let previewText: string | null =
          originalMessage.text ||
          originalMessage.fileName ||
          (originalMessage.type === "image"
            ? "📷 Image"
            : originalMessage.type === "document"
            ? "📄 Document"
            : originalMessage.product?.name
            ? `📦 ${originalMessage.product.name}`
            : "an attachment");
        messageData.replyToText = previewText;
        if (originalMessage.type === "image" && originalMessage.mediaUrl) {
          messageData.replyToMediaUrl = originalMessage.mediaUrl;
        } else if (
          originalMessage.type === "product" &&
          originalMessage.product?.images?.[0]?.url
        ) {
          messageData.replyToMediaUrl = originalMessage.product.images[0].url;
        }
      }
    } // Handle media messages using user's ImgBB key

    const handleMedia = async (media: {
      id: string;
      caption?: string;
      filename?: string;
    }) => {
      if (media.id && settings.imgbbApiKey) {
        const decryptedImgbbKey = decrypt(settings.imgbbApiKey);
        const temporaryMediaUrl = await getWhatsAppMediaUrl(
          media.id,
          settings.whatsappAccessToken!
        );
        if (temporaryMediaUrl) {
          messageData.mediaUrl = await downloadAndUploadMedia(
            temporaryMediaUrl,
            settings.whatsappAccessToken!,
            decryptedImgbbKey,
            media.filename
          );
        }
      }
      messageData.text = media.caption || "";
      messageData.fileName = media.filename;
    };

    switch (msg.type) {
      case "text":
        messageData.text = msg.text.body;
        break;
      case "image":
        await handleMedia({ id: msg.image?.id, caption: msg.image?.caption });
        break;
      case "document":
        await handleMedia({
          id: msg.document?.id,
          caption: msg.document?.caption,
          filename: msg.document?.filename || "document",
        });
        break;
      default:
        messageData.type = "unsupported";
        messageData.text = `Received an unsupported message type: ${msg.type}`;
    }

    const savedMessage = await prisma.message.create({
      data: messageData,
      include: { contact: true },
    }); // NEW LOGIC: Emit new message event to the external Render server

    emitEventToRender(
      isGroupMessage ? "newGroupMessage" : "newMessage",
      savedMessage
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ WhatsApp Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
