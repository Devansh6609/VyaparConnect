// src/app/api/broadcasts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import {
  sendWhatsAppMessage,
  sendWhatsAppImageMessage,
  WhatsAppCredentials,
} from "@/lib/whatsapp";

async function getUserWhatsAppCredentials(
  userId: string
): Promise<WhatsAppCredentials | null> {
  const settings = await prisma.settings.findUnique({ where: { userId } });
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

// GET all broadcasts
export async function GET() {
  const session = await getAuthSession();
  if (!session?.user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const broadcasts = await prisma.broadcast.findMany({
      where: { userId: session.user.id },
      orderBy: { sentAt: "desc" },
      include: { _count: { select: { recipients: true } } },
    });
    return NextResponse.json(broadcasts);
  } catch (error) {
    console.error("GET /api/broadcasts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch broadcasts" },
      { status: 500 }
    );
  }
}

// POST to create and send a new broadcast
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = session.user.id;

  try {
    const { tagIds, message, templateId, imageUrl } = await req.json();

    if (!tagIds || tagIds.length === 0 || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const contacts = await prisma.contact.findMany({
      where: { userId, tags: { some: { id: { in: tagIds } } } },
    });

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: "No contacts found with the selected tags." },
        { status: 400 }
      );
    }

    const newBroadcast = await prisma.broadcast.create({
      data: {
        userId,
        message,
        templateId,
        status: "SENDING",
        recipients: {
          create: contacts.map((contact) => ({ contactId: contact.id })),
        },
      },
      include: { recipients: true },
    });

    // Asynchronously send messages
    (async () => {
      let successCount = 0;
      for (const recipient of newBroadcast.recipients) {
        const contact = contacts.find((c) => c.id === recipient.contactId);
        if (!contact) continue;

        try {
          let waResponse;
          if (imageUrl) {
            // Send image with message as caption
            waResponse = await sendWhatsAppImageMessage(
              contact.phone,
              imageUrl,
              message,
              creds
            );
          } else {
            // Send template message (simulated as text)
            // In a real app, you'd use the template endpoint here with templateId and params
            waResponse = await sendWhatsAppMessage(
              contact.phone,
              message,
              creds
            );
          }
          const wamid = waResponse?.messages?.[0]?.id;

          await prisma.broadcastRecipient.update({
            where: { id: recipient.id },
            data: { status: wamid ? "SENT" : "FAILED" },
          });

          if (wamid) successCount++;
        } catch (err) {
          console.error(`Failed to send broadcast to ${contact.phone}`, err);
          await prisma.broadcastRecipient.update({
            where: { id: recipient.id },
            data: { status: "FAILED" },
          });
        }
      }

      await prisma.broadcast.update({
        where: { id: newBroadcast.id },
        data: {
          status: successCount === contacts.length ? "COMPLETED" : "FAILED",
        },
      });
    })();

    return NextResponse.json(newBroadcast, { status: 201 });
  } catch (error) {
    console.error("POST /api/broadcasts error:", error);
    return NextResponse.json(
      { error: "Failed to create broadcast" },
      { status: 500 }
    );
  }
}
