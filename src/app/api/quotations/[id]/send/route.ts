// src/app/api/quotations/[id]/send/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWhatsAppMessage, WhatsAppCredentials } from "@/lib/whatsapp";
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

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id: quotationId } = await context.params;
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { contact: true, items: { include: { product: true } } },
    });

    if (!quotation || !quotation.contact) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Authorization check
    if (quotation.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const creds = await getUserWhatsAppCredentials(quotation.userId);
    if (!creds) {
      return NextResponse.json(
        {
          error:
            "WhatsApp is not configured. Please add your credentials in Settings.",
        },
        { status: 400 }
      );
    }

    // 1. Construct the message
    let messageText = `*Quotation #${quotation.id.substring(0, 6)}*\n\nHi ${
      quotation.customerName
    },\nHere is the quotation you requested:\n\n`;
    quotation.items.forEach((item) => {
      messageText += `*${item.product?.name}* x ${item.quantity}\n`;
    });
    messageText += `\n*Total: ₹${quotation.total.toLocaleString(
      "en-IN"
    )}*\n\nPlease let us know if you'd like to proceed.`;

    // 2. Send via WhatsApp
    const waResponse = await sendWhatsAppMessage(
      quotation.contact.phone,
      messageText,
      creds
    );
    const wamid = waResponse?.messages?.[0]?.id;

    // 3. Save to our message history
    const savedMessage = await prisma.message.create({
      data: {
        from: "business",
        to: quotation.contact.phone,
        type: "text",
        text: messageText,
        contactId: quotation.contact.id,
        wamid: wamid,
        status: wamid ? "sent" : "failed",
      },
    });
    await emitSocketEvent("newMessage", savedMessage);

    // 4. Update quotation status
    const updatedQuotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: "SENT" },
    });

    return NextResponse.json({ success: true, quotation: updatedQuotation });
  } catch (error) {
    console.error(`Failed to send quotation ${quotationId}:`, error);
    return NextResponse.json(
      { error: "Failed to send quotation" },
      { status: 500 }
    );
  }
}
