// src/app/api/messages/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  sendWhatsAppMessage,
  sendWhatsAppImageMessage,
  sendWhatsAppDocumentMessage,
  WhatsAppCredentials,
} from "@/lib/whatsapp";
import { emitSocketEvent } from "@/lib/socket-server";
import { getAuthSession } from "@/lib/auth";

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

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get("contactId");
  const limit = parseInt(searchParams.get("limit") || "30");
  const cursor = searchParams.get("cursor");

  try {
    if (contactId) {
      const messages = await prisma.message.findMany({
        take: -limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        where: { contactId },
        orderBy: { createdAt: "asc" },
        include: { product: { include: { images: true } } },
      });

      let nextCursor: typeof cursor | null = null;
      if (messages.length === limit) {
        nextCursor = messages[0].id;
      }

      return NextResponse.json({ messages, nextCursor });
    }

    return NextResponse.json({ messages: [], nextCursor: null });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await req.json();
    const {
      contactId,
      text,
      replyingToId,
      productId,
      type = "text",
      mediaUrl,
      fileName,
    } = body;

    if (!contactId) {
      return NextResponse.json(
        { error: "contactId is required" },
        { status: 400 }
      );
    }

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

    const contact = await prisma.contact.findUnique({
      where: { id: contactId, userId: userId }, // Ensure contact belongs to user
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // --- Handle Product Sharing ---
    if (type === "product" && productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId, userId: userId },
        include: { images: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      const finalMessages = [];

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
          include: { product: { include: { images: true } }, contact: true },
        });
        finalMessages.push(savedImageMsg);
      }

      const productDetailsText = `*${product.name}*\n\n*Description:*\n${
        product.description || "No description available."
      }\n\n*Price: ₹${product.price.toLocaleString("en-IN")}*`;
      const savedTextMsg = await prisma.message.create({
        data: {
          from: "business",
          to: contact.phone,
          type: "text",
          text: productDetailsText,
          contactId: contact.id,
          status: "pending",
        },
        include: { product: { include: { images: true } }, contact: true },
      });
      finalMessages.push(savedTextMsg);

      (async () => {
        try {
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
            await emitSocketEvent("message-status-update", {
              id: updatedMsg.id,
              status: newStatus,
              wamid,
            });
          }

          const waResponse = await sendWhatsAppMessage(
            contact.phone,
            productDetailsText,
            creds
          );
          const wamid = waResponse?.messages?.[0]?.id;
          const newStatus = wamid ? "sent" : "failed";
          const updatedMsg = await prisma.message.update({
            where: { id: savedTextMsg.id },
            data: { wamid, status: newStatus },
          });
          await emitSocketEvent("message-status-update", {
            id: updatedMsg.id,
            status: newStatus,
            wamid,
          });
        } catch (err) {
          console.error("Error sending product sequence to WhatsApp:", err);
          const messageIds = finalMessages.map((m) => m.id);
          const pendingMessages = await prisma.message.findMany({
            where: { id: { in: messageIds }, status: "pending" },
          });
          for (const msg of pendingMessages) {
            await prisma.message.update({
              where: { id: msg.id },
              data: { status: "failed" },
            });
            await emitSocketEvent("message-status-update", {
              id: msg.id,
              status: "failed",
            });
          }
        }
      })();
      return NextResponse.json(finalMessages);
    }

    // --- Handle Standard Messages ---
    let messageData: any = {
      from: "business",
      to: contact.phone,
      type,
      text,
      mediaUrl,
      fileName,
      contactId,
      productId,
      status: "pending",
    };
    let repliedMsgWamid: string | null = null;

    if (replyingToId) {
      const repliedMsg = await prisma.message.findUnique({
        where: { id: replyingToId },
        include: { product: { include: { images: true } } },
      });
      if (repliedMsg) {
        messageData.replyToId = repliedMsg.id;
        let previewText =
          repliedMsg.text ||
          repliedMsg.fileName ||
          (repliedMsg.type === "image"
            ? "📷 Image"
            : repliedMsg.type === "document"
            ? "📄 Document"
            : repliedMsg.product?.name
            ? `📦 ${repliedMsg.product.name}`
            : "an attachment");
        messageData.replyToText = previewText;
        messageData.replyToMediaUrl =
          repliedMsg.type === "image" && repliedMsg.mediaUrl
            ? repliedMsg.mediaUrl
            : repliedMsg.type === "product" &&
              repliedMsg.product?.images?.[0]?.url
            ? repliedMsg.product.images[0].url
            : null;
        repliedMsgWamid = repliedMsg.wamid;
      }
    }

    const savedMessage = await prisma.message.create({
      data: messageData,
      include: { product: { include: { images: true } }, contact: true },
    });
    await emitSocketEvent("newMessage", savedMessage);

    let waResponse;

    if (savedMessage.type === "image" && savedMessage.mediaUrl) {
      waResponse = await sendWhatsAppImageMessage(
        contact.phone,
        savedMessage.mediaUrl,
        savedMessage.text || "",
        creds,
        repliedMsgWamid
      );
    } else if (savedMessage.type === "document" && savedMessage.mediaUrl) {
      waResponse = await sendWhatsAppDocumentMessage(
        contact.phone,
        savedMessage.mediaUrl,
        savedMessage.text || "",
        savedMessage.fileName || "document",
        creds,
        repliedMsgWamid
      );
    } else if (savedMessage.type === "text" && savedMessage.text) {
      waResponse = await sendWhatsAppMessage(
        contact.phone,
        savedMessage.text,
        creds,
        repliedMsgWamid
      );
    }

    const wamid = waResponse?.messages?.[0]?.id;
    const newStatus = wamid ? "sent" : "failed";
    const finalMessage = await prisma.message.update({
      where: { id: savedMessage.id },
      data: { wamid, status: newStatus },
      include: { contact: true, product: { include: { images: true } } },
    });
    await emitSocketEvent("message-status-update", {
      id: finalMessage.id,
      status: finalMessage.status,
      wamid: finalMessage.wamid,
    });

    return NextResponse.json(finalMessage);
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
