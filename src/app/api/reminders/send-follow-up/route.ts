// src/app/api/reminders/send-follow-up/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWhatsAppMessage, WhatsAppCredentials } from "@/lib/whatsapp";
import { getIO } from "@/lib/socket";
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

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { quotationId, contactId } = await req.json();

    if (!quotationId || !contactId) {
      return NextResponse.json(
        { error: "Quotation ID and Contact ID are required." },
        { status: 400 }
      );
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { contact: true },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found." },
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

    const messageText = `Hi ${
      quotation.customerName
    }, this is a friendly follow-up regarding Quotation #${quotation.id.substring(
      0,
      6
    )} for ₹${quotation.total.toLocaleString(
      "en-IN"
    )}. Please let us know if you have any questions or are ready to proceed. Thank you!`;

    // 1. Send via WhatsApp
    const waResponse = await sendWhatsAppMessage(
      quotation.contact.phone,
      messageText,
      creds
    );
    const wamid = waResponse?.messages?.[0]?.id;

    // 2. Save to our message history
    const savedMessage = await prisma.message.create({
      data: {
        from: "business",
        to: quotation.contact.phone,
        type: "text",
        text: messageText,
        contactId: contactId,
        wamid: wamid,
        status: wamid ? "sent" : "failed",
      },
    });
    getIO()?.emit("newMessage", savedMessage);

    // 3. Update quotation timestamp to prevent it from reappearing in follow-ups immediately
    await prisma.quotation.update({
      where: { id: quotationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: `Follow-up sent for quotation ${quotationId}`,
    });
  } catch (error) {
    console.error("POST /api/reminders/send-follow-up error:", error);
    return NextResponse.json(
      { error: "Failed to send follow-up reminder" },
      { status: 500 }
    );
  }
}
