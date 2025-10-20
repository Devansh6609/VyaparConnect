// src/app/api/quotations/[id]/payments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emitSocketEvent } from "@/lib/socket";
import { sendWhatsAppMessage, WhatsAppCredentials } from "@/lib/whatsapp";

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

// GET all payments for a quotation
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quotationId = params.id;
    if (!quotationId) {
      return NextResponse.json(
        { error: "Quotation ID is required" },
        { status: 400 }
      );
    }

    const payments = await prisma.payment.findMany({
      where: { quotationId: quotationId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST to add a manual payment to a quotation
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quotationId = params.id;
    const { amount, method, notes } = await req.json();

    if (!amount || !method) {
      return NextResponse.json(
        { error: "Amount and method are required" },
        { status: 400 }
      );
    }

    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount) || floatAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { contact: true },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    await prisma.payment.create({
      data: {
        quotationId,
        amount: floatAmount,
        method,
        notes,
        status: "PAID",
      },
    });

    const allPayments = await prisma.payment.findMany({
      where: { quotationId, status: "PAID" },
    });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    const newStatus = totalPaid >= quotation.total ? "PAID" : "PARTIALLY_PAID";
    await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: newStatus },
    });

    // Send confirmation message, but don't fail the request if it errors out
    try {
      const creds = await getUserWhatsAppCredentials(quotation.contact.userId);
      if (creds) {
        const confirmationText = `✅ Payment Recorded. We have recorded your ${method} payment of ₹${floatAmount.toLocaleString(
          "en-IN"
        )}. Total Paid: ₹${totalPaid.toLocaleString("en-IN")}. Thank you!`;

        const waResponse = await sendWhatsAppMessage(
          quotation.contact.phone,
          confirmationText,
          creds
        );
        const wamid = waResponse?.messages?.[0]?.id;

        const savedMessage = await prisma.message.create({
          data: {
            from: "business",
            to: quotation.contact.phone,
            type: "text",
            text: confirmationText,
            contactId: quotation.contact.id,
            wamid: wamid,
            status: wamid ? "sent" : "failed",
          },
        });
        await emitSocketEvent("newMessage", savedMessage);
      } else {
        console.warn(
          `Could not send WhatsApp confirmation for quotation ${quotationId} - no credentials found for user ${quotation.contact.userId}`
        );
      }
    } catch (messageError) {
      console.error(
        `Could not send WhatsApp confirmation for quotation ${quotationId}:`,
        messageError
      );
    }

    const updatedQuotationWithPayments = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { payments: true },
    });
    await emitSocketEvent("quotation_update", updatedQuotationWithPayments);

    return NextResponse.json(updatedQuotationWithPayments, { status: 201 });
  } catch (error) {
    console.error("Failed to record manual payment:", error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
