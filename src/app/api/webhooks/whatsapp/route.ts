// src/app/api/webhooks/whatsapp/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { emitSocketEvent } from "@/lib/socket-server";
import { decrypt } from "@/lib/crypto";

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
  fileName?: string | null
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
      console.error(
        "Failed to download media from WhatsApp.",
        await downloadResponse.text()
      );
      return null;
    }
    const fileBuffer = await downloadResponse.arrayBuffer();
    const contentType =
      downloadResponse.headers.get("Content-Type") ||
      "application/octet-stream";

    const file = new Blob([fileBuffer], { type: contentType });

    const formData = new FormData();
    // Construct a file name with extension. e.g., 'image.jpeg'
    const extension = contentType.split("/")[1] || "bin";
    const uploadFileName = fileName || `media.${extension}`;

    formData.append("image", file, uploadFileName);

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
  const uid = searchParams.get("uid"); // User ID from query param

  if (!uid) {
    console.error(
      "❌ WhatsApp Webhook Verification Failed: Missing user ID (uid) in callback URL."
    );
    return new NextResponse("Forbidden: Missing user identifier", {
      status: 403,
    });
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: { userId: uid },
      select: { whatsappVerifyToken: true },
    });

    if (
      mode === "subscribe" &&
      settings &&
      token === settings.whatsappVerifyToken
    ) {
      console.log(`✅ WhatsApp Webhook Verified for user ${uid}.`);
      return new NextResponse(challenge ?? "", { status: 200 });
    }

    console.error(
      `❌ WhatsApp Webhook Verification Failed for user ${uid}. Token mismatch or user not found.`
    );
    return new NextResponse("Forbidden", { status: 403 });
  } catch (error) {
    console.error(`Error during webhook verification for user ${uid}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
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
    }

    // --- Message Status Update Logic ---
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
          await emitSocketEvent("message-status-update", {
            wamid,
            status: appStatus,
          });
          console.log(`✅ Message ${wamid} status updated to ${appStatus}`);
        }
      }
      return NextResponse.json({ success: true });
    }

    // --- New Incoming Message Logic ---
    if (!value.messages || !settings.whatsappAccessToken) {
      return NextResponse.json({ status: "not a message or token missing" });
    }

    const decryptedToken = decrypt(
      settings.whatsappAccessToken,
      settings.userId
    );

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
      let contact = await prisma.contact.findFirst({
        where: { phone: from, userId: settings.userId },
      });
      if (!contact) {
        contact = await prisma.contact.create({
          data: {
            phone: from,
            name: contactName,
            userId: settings.userId,
            stage: "NEW_LEAD",
          },
        });
        await emitSocketEvent("new_lead", contact);
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
    }

    // Handle media messages using user's ImgBB key
    const handleMedia = async (media: {
      id: string;
      caption?: string;
      filename?: string | null;
    }) => {
      if (media.id && settings.imgbbApiKey) {
        const decryptedImgbbKey = decrypt(
          settings.imgbbApiKey,
          settings.userId
        );
        const temporaryMediaUrl = await getWhatsAppMediaUrl(
          media.id,
          decryptedToken
        );
        if (temporaryMediaUrl) {
          messageData.mediaUrl = await downloadAndUploadMedia(
            temporaryMediaUrl,
            decryptedToken,
            decryptedImgbbKey,
            media.filename
          );
        }
      }
      messageData.text = media.caption || "";
      messageData.fileName = media.filename;

      // If media processing failed, don't save it as a media message type
      if (!messageData.mediaUrl) {
        // Append a user-facing error message to the caption
        const originalText = messageData.text ? `${messageData.text}\n\n` : "";
        messageData.text = `${originalText}[System: Failed to process attached media. Please check your media hosting (ImgBB) API key in settings.]`;
        messageData.type = "text"; // Fallback to text message
      }
    };

    switch (msg.type) {
      case "text":
        messageData.text = msg.text.body;
        break;
      case "image":
        await handleMedia({
          id: msg.image?.id,
          caption: msg.image?.caption,
          filename: null,
        });
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
    });

    await emitSocketEvent(
      isGroupMessage ? "newGroupMessage" : "newMessage",
      savedMessage
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ WhatsApp Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
