// src/app/api/orders/[id]/payments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";
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

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user) {
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

    try {
      const creds = await getUserWhatsAppCredentials(order.contact.userId);
      if (creds) {
        const confirmationText = `✅ Payment Recorded. We have recorded your ${method} payment of ₹${floatAmount.toLocaleString(
          "en-IN"
        )}. Total Paid: ₹${totalPaid.toLocaleString("en-IN")}. Thank you!`;
        await sendWhatsAppMessage(order.contact.phone, confirmationText, creds);
        getIO()?.emit(
          "newMessage",
          await prisma.message.create({
            data: {
              from: "business",
              to: order.contact.phone,
              type: "text",
              text: confirmationText,
              contactId: order.contact.id,
            },
          })
        );
      }
    } catch (messageError) {
      console.error(
        `Could not send WhatsApp confirmation for order ${orderId}:`,
        messageError
      );
    }

    // Since socket events are not implemented for orders, we return the full updated object for client-side state update
    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payments: true,
        items: { include: { product: true } },
        contact: true,
      },
    });

    return NextResponse.json(updatedOrder, { status: 201 });
  } catch (error) {
    console.error("Failed to record manual payment for order:", error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
