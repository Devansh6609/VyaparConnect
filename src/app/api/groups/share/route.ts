// src/app/api/groups/share/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";
import {
  sendWhatsAppMessage,
  sendWhatsAppImageMessage,
  WhatsAppCredentials,
} from "@/lib/whatsapp";
import { getAuthSession } from "@/lib/auth";
// FIX: Used type-only import to prevent module resolution errors.
import type { Contact } from "../../../../types";

async function getUserWhatsAppCredentials(
  userId: string
): Promise<WhatsAppCredentials | null> {
  const settings = await prisma.settings.findUnique({
    where: { userId },
  });
  if (
    settings &&
    settings.whatsappAccessToken &&
    settings.whatsappPhoneNumberId
  ) {
    return {
      token: settings.whatsappAccessToken,
      phoneId: settings.whatsappPhoneNumberId,
    };
  }
  return null;
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const { productId, groupIds, message } = await req.json();

    if (
      !productId ||
      !Array.isArray(groupIds) ||
      groupIds.length === 0 ||
      !message
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: productId, groupIds, and message are required.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, userId },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const groupsWithContacts = await prisma.group.findMany({
      where: { id: { in: groupIds }, userId },
      include: { contacts: true },
    });

    const uniqueContacts = new Map<string, Contact>();
    groupsWithContacts.forEach((group) => {
      group.contacts.forEach((contact) => {
        uniqueContacts.set(contact.id, contact as any);
      });
    });

    const creds = await getUserWhatsAppCredentials(userId);
    if (!creds) {
      return NextResponse.json(
        {
          error:
            "WhatsApp is not configured. Please add your credentials in Settings.",
        },
        { status: 400 }
      );
    }

    // Asynchronously send messages to all unique contacts
    (async () => {
      for (const contact of Array.from(uniqueContacts.values())) {
        try {
          const finalMessages = [];

          // 1. Create DB records for all image messages
          for (const image of product.images) {
            const savedImageMsg = await prisma.message.create({
              data: {
                from: "business",
                to: contact.phone,
                type: "image",
                mediaUrl: image.url,
                contactId: contact.id,
                status: "pending",
              },
            });
            finalMessages.push(savedImageMsg);
          }

          // 2. Create DB record for the text message
          const savedTextMsg = await prisma.message.create({
            data: {
              from: "business",
              to: contact.phone,
              type: "text",
              text: message,
              contactId: contact.id,
              status: "pending",
            },
          });
          finalMessages.push(savedTextMsg);

          // Emit messages to UI optimistically
          finalMessages.forEach((msg) => getIO()?.emit("newMessage", msg));

          // 3. Send to WhatsApp and update statuses
          for (const image of product.images) {
            const imageMessage = finalMessages.find(
              (msg) => msg.mediaUrl === image.url && msg.type === "image"
            );
            if (!imageMessage) continue;

            const waResponse = await sendWhatsAppImageMessage(
              contact.phone,
              image.url,
              "",
              creds
            );
            const wamid = waResponse?.messages?.[0]?.id;

            const newStatus = wamid ? "sent" : "failed";
            const updatedMsg = await prisma.message.update({
              where: { id: imageMessage.id },
              data: { wamid, status: newStatus },
            });
            getIO()?.emit("message-status-update", {
              id: updatedMsg.id,
              status: newStatus,
              wamid,
            });
          }

          const waResponse = await sendWhatsAppMessage(
            contact.phone,
            message,
            creds
          );
          const wamid = waResponse?.messages?.[0]?.id;

          const newStatus = wamid ? "sent" : "failed";
          const updatedMsg = await prisma.message.update({
            where: { id: savedTextMsg.id },
            data: { wamid, status: newStatus },
          });
          getIO()?.emit("message-status-update", {
            id: updatedMsg.id,
            status: newStatus,
            wamid,
          });
        } catch (err) {
          console.error(`Failed to send message to ${contact.phone}:`, err);
        }
      }
    })();

    return NextResponse.json({
      success: true,
      message: `Sharing initiated to ${uniqueContacts.size} contacts.`,
    });
  } catch (error) {
    console.error("POST /api/groups/share error:", error);
    return NextResponse.json(
      { error: "Failed to initiate sharing" },
      { status: 500 }
    );
  }
}
