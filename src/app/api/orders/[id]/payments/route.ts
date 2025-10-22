// src/app/api/orders/[id]/payments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emitSocketEvent } from "@/lib/socket-server";
import { sendWhatsAppMessage, WhatsAppCredentials } from "@/lib/whatsapp";
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

// GET all payments for an order
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const payments = await prisma.payment.findMany({
      where: { orderId: orderId },
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

// POST to add a manual payment to an order
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const orderId = params.id;
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

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: { contact: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.payment.create({
      data: {
        orderId,
        amount: floatAmount,
        method,
        notes,
        status: "PAID",
      },
    });

    const allPayments = await prisma.payment.findMany({
      where: { orderId, status: "PAID" },
    });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    const newStatus = totalPaid >= order.total ? "PAID" : "PARTIALLY_PAID";
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: newStatus },
    });

    // Send confirmation message, but don't fail the request if it errors out
    try {
      const creds = await getUserWhatsAppCredentials(order.contact.userId);
      if (creds) {
        const confirmationText = `✅ Payment Recorded. We have recorded your ${method} payment of ₹${floatAmount.toLocaleString(
          "en-IN"
        )}. Total Paid: ₹${totalPaid.toLocaleString("en-IN")}. Thank you!`;

        const waResponse = await sendWhatsAppMessage(
          order.contact.phone,
          confirmationText,
          creds
        );
        const wamid = waResponse?.messages?.[0]?.id;

        const savedMessage = await prisma.message.create({
          data: {
            from: "business",
            to: order.contact.phone,
            type: "text",
            text: confirmationText,
            contactId: order.contact.id,
            wamid: wamid,
            status: wamid ? "sent" : "failed",
          },
        });
        await emitSocketEvent("newMessage", savedMessage);
      } else {
        console.warn(
          `Could not send WhatsApp confirmation for order ${orderId} - no credentials found for user ${order.contact.userId}`
        );
      }
    } catch (messageError) {
      console.error(
        `Could not send WhatsApp confirmation for order ${orderId}:`,
        messageError
      );
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payments: true,
        items: { include: { product: true } },
        contact: true,
      },
    });
    await emitSocketEvent("order_update", updatedOrder);

    return NextResponse.json(updatedOrder, { status: 201 });
  } catch (error) {
    console.error("Failed to record manual payment for order:", error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
